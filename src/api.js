
const browser = require('./browser');
const logging = require('./logging');


module.exports = async function(req, res) {
  let input = req.body;

  if (!input.url && !input.content) {
    res.status(400);
    res.json({error: 'url or content required'});
    return;
  }

  if (input.url) {
    logging.log('====== URL request');
    logging.log(`====== ${input.url}`);
  } else {
    logging.log('====== Content request');
    logging.log(`====== Length: ${input.content.length}`);
  }

  print(res, input)
    .then(pdf => {
      res.type('pdf');
      res.send(pdf);
    })
    .catch(err => {
      logging.error('PDF generation failed:', err);

      res.status(500);
      res.json({error: err});
    });
};


async function print(res, input) {
  let page = await browser.instance.newPage();
  page.on('request', request => {
    if (request.url().indexOf('data:') === 0) {
      logging.log(`-- data request, length: ${request.url().length}`);
    } else {
      logging.log(`-- request: ${request.url()}`);
    }
  });

  page.on('requestfailed', request => {
    logging.error(`-- request failed: ${request.url()}`);

    throw new Error(`request failed: ${request.url()}`);
  });

  logging.log('[*] Navigate to page');
  if (input.url) {
    await page.goto(input.url, {
      timeout: 25000,
      waitUntil: ['networkidle0', 'load'],
    });
  } else {
    await page.goto(`data:text/html,${input.content}`, {
      timeout: 25000,
      waitUntil: ['networkidle0', 'load'],
    });
  }

  logging.log('[*] Generate PDF');

  let marginTop = input.marginTop ? input.marginTop : '';
  let marginBottom = input.marginBottom ? input.marginBottom : '';
  let marginRight = input.marginRight ? input.marginRight : '';
  let marginLeft = input.marginLeft ? input.marginLeft : '';

  let pdf = await page.pdf({
    printBackground: true,
    format: 'A4',
    displayHeaderFooter: input.header || input.footer,
    headerTemplate: input.header,
    footerTemplate: input.footer,
    margin: { 
      top: marginTop, 
      bottom: marginBottom,
      right: marginRight,
      left: marginLeft,
    },
  });
  
  await page.close();

  return pdf;
}

