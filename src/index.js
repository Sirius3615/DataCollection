// text.replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const express = require('express');

const app = express();

// Array of URLs to scrape
const urlsToScrape = ["https://donate.wikimedia.org/wiki/Special:FundraiserRedirector?utm_source=donate&utm_medium=sidebar&utm_campaign=C13_en.wikipedia.org&uselang=en","https://en.wikinews.org/wiki/Category:Croatia","https://en.wikivoyage.org/wiki/Croatia","https://als.wikipedia.org/wiki/Kroatien","https://bar.wikipedia.org/wiki/Krowozien","https://da.wikipedia.org/wiki/Kroatien","https://de.wikipedia.org/wiki/Kroatien","https://lb.wikipedia.org/wiki/Kroatien","https://frr.wikipedia.org/wiki/Kroaatien","https://nds.wikipedia.org/wiki/Kroatien","https://stq.wikipedia.org/wiki/Kroatien","https://sv.wikipedia.org/wiki/Kroatien","https://en.wiktionary.org/wiki/Reconstruction:Proto-Slavic/x%D1%8Arvat%D1%8A","https://en.wikipedia.org/w/index.php?title=Croatia&action=edit","https://en.wikipedia.org/w/index.php?title=Croatia&action=edit","https://en.wikipedia.org/w/index.php?title=Croatia&action=edit","https://en.wikipedia.org/w/index.php?title=Croatia&action=edit","https://en.wikipedia.org/w/index.php?title=Croatia&action=edit","https://en.wikipedia.org/w/index.php?title=Template:Largest_cities_of_Croatia&action=edit","https://en.wikipedia.org/w/index.php?title=Croatia&action=edit","https://en.wikipedia.org/w/index.php?title=Croatia&action=edit","http://web.dzs.hr/Eng/censuses/census2011/results/htm/e01_01_08/e01_01_08_RH.html","https://www.croatiaweek.com/share-of-croats-in-croatia-increases-as-census-results-published/","https://narodne-novine.nn.hr/clanci/sluzbeni/2019_11_110_2212.html","https://www.imf.org/en/Publications/WEO/weo-database/2022/October/weo-report?c=960,&s=NGDPD,PPPGDP,NGDPDPC,PPPPC,&sy=2020&ey=2027&ssm=0&scsm=1&scc=0&ssd=1&ssc=0&sic=0&sort=country&ds=.&br=1","https://ec.europa.eu/eurostat/databrowser/view/tessi190/default/table?lang=en","https://hdr.undp.org/system/files/documents/global-report-document/hdr2021-22pdf_1.pdf","https://web.archive.org/web/20220908114232/hdr.undp.org/system/files/documents/global-report-document/hdr2021-22pdf_1.pdf","https://hrcak.srce.hr/228825?lang=en","http://www.matica.hr/vijenac/291/hrvatski-nacionalni-dan-na-expou-u-japanu-9037/","http://hrcak.srce.hr/index.php?show=clanak&id_clanak_jezik=28729&lang=en","http://hrcak.srce.hr/index.php?show=clanak&id_clanak_jezik=64623&lang=en","https://hrcak.srce.hr/en/clanak/18748","http://www.hkd.at/index.php?option=com_content&view=article&id=61&Itemid=102&lang=hr","https://web.archive.org/web/20121114132821/http://www.hkd.at/index.php?option=com_content&view=article&id=61&Itemid=102&lang=hr","http://hrcak.srce.hr/index.php?show=clanak&id_clanak_jezik=38709&lang=en","http://www.enciklopedija.hr/natuknica.aspx?ID=32708","https://hrcak.srce.hr/213638?lang=en","http://hrcak.srce.hr/index.php?show=clanak&id_clanak_jezik=76413&lang=en","https://www.independent.co.uk/arts-entertainment/obituary-franjo-tudjman-1132142.html","https://web.archive.org/web/20121110024351/http://www.independent.co.uk/arts-entertainment/obituary-franjo-tudjman-1132142.html","https://www.nytimes.com/1991/06/26/world/2-yugoslav-states-vote-independence-to-press-demands.html","https://web.archive.org/web/20121110162855/http://www.nytimes.com/1991/06/26/world/2-yugoslav-states-vote-independence-to-press-demands.html","https://articles.latimes.com/1991-08-01/news/mn-177_1_defense-force","https://web.archive.org/web/20120516054837/http://articles.latimes.com/1991-08-01/news/mn-177_1_defense-force","https://www.nytimes.com/1991/12/24/world/slovenia-and-croatia-get-bonn-s-nod.html","https://web.archive.org/web/20120620034701/http://www.nytimes.com/1991/12/24/world/slovenia-and-croatia-get-bonn-s-nod.html","http://www.setimes.com/cocoon/setimes/xhtml/en_GB/features/setimes/features/2008/11/20/feature-01","https://www.usud.hr/en/history-and-development-croatian-constitutional-judicature#9","http://www.enciklopedija.hr/natuknica.aspx?ID=46827","http://europa.eu/rapid/pressReleasesAction.do?reference=IP/11/824&format=HTML&aged=0&language=EN&guiLanguage=en","https://web.archive.org/web/20120123185048/http://europa.eu/news/external-relations/2011/03/20110302_en.htm","http://europa.eu/news/external-relations/2011/03/20110302_en.htm","https://www.andrejplenkovic.hr/page.php?id=1","https://www.livecamcroatia.com/en/blog/dinara-has-become-the-new-nature-park-in-croatia/","https://web.archive.org/web/20120609163634/http://www.geografija.hr/clanci/1011/rasirenost-krsa-u-hrvatskoj","http://www.geografija.hr/clanci/1011/rasirenost-krsa-u-hrvatskoj","http://klima.hr/razno.php?id=priopcenja&param=pr21072017","http://www.dzzp.hr/dokumenti_upload/20120515/dzzp201205151608230.pdf","https://ghostarchive.org/archive/20221009/http://www.dzzp.hr/dokumenti_upload/20120515/dzzp201205151608230.pdf","http://www.dubrovnik2011.sdewes.org/venue.php","https://web.archive.org/web/20130905201133/http://www.vlada.hr/en/about_croatia/information/political_structure","http://www.vlada.hr/en/about_croatia/information/political_structure","https://web.archive.org/web/20130604052735/http://www.vlada.hr/en/naslovnica/o_vladi_rh/clanovi_vlade","http://www.vlada.hr/en/naslovnica/o_vladi_rh/clanovi_vlade","https://web.archive.org/web/20120326105744/http://www.delhrv.ec.europa.eu/?lang=en&content=62","http://www.delhrv.ec.europa.eu/?lang=en&content=62","https://narodne-novine.nn.hr/clanci/sluzbeni/2013_03_28_473.html","https://www.soa.hr/en/about-us/security-intelligence-system-of-the-republic-of-croatia/","https://books.google.com/books?id=_00UDQAAQBAJ&q=Handbook+of+European+Intelligence+Cultures","http://www.mvep.hr/en/foreign-politics/bilateral-relations/date-of-recognition-and-establishment-of-diplomatic-relations/","https://www.total-croatia-news.com/politics/16084-overview-of-croatia-s-border-disputes-with-bij-montenegro-serbia-slovenia-liberland","http://www.osrh.hr/prikaz_en.asp?idi=100&kati=2","https://web.archive.org/web/20130828162010/http://narodne-novine.nn.hr/clanci/sluzbeni/1992_12_90_2333.html","http://narodne-novine.nn.hr/clanci/sluzbeni/1992_12_90_2333.html","http://narodne-novine.nn.hr/clanci/sluzbeni/2006_07_86_2045.html","https://www.imf.org/en/Publications/WEO/weo-database/2022/April/weo-report","https://ec.europa.eu/eurostat/tgm/graph.do?tab=graph&plugin=1&pcode=tec00114&language=en&toolbox=type","https://web.archive.org/web/20060822000014/http://epp.eurostat.ec.europa.eu/portal/page?_pageid=1996%2C39140985&_dad=portal&_schema=PORTAL&screen=detailref&language=en&product=STRIND_ECOBAC&root=STRIND_ECOBAC%2Fecobac%2Feb012","http://epp.eurostat.ec.europa.eu/portal/page?_pageid=1996,39140985&_dad=portal&_schema=PORTAL&screen=detailref&language=en&product=STRIND_ECOBAC&root=STRIND_ECOBAC/ecobac/eb012","https://www.theglobaleconomy.com/Croatia/Unemployment_rate/","https://www.transparency.org/files/content/pages/2018_CPI_Executive_Summary.pdf","https://ghostarchive.org/archive/20221009/https://www.transparency.org/files/content/pages/2018_CPI_Executive_Summary.pdf","https://web.archive.org/web/20120429102936/http://www.opatija-tourism.hr/en/Home.aspx?PageID=5","http://www.opatija-tourism.hr/en/Home.aspx?PageID=5","http://croatia.hr/en-GB/Activities-and-attractions","https://web.archive.org/web/20111202124844/http://www.blueflag.org/Menu/Awarded+sites/2011/Northern+Hemisphere/Croatia","http://www.blueflag.org/Menu/Awarded+sites/2011/Northern+Hemisphere/Croatia","https://doi.org/10.18111%2Fwtobarometereng.2019.17.1.2","http://narodne-novine.nn.hr/clanci/sluzbeni/2009_01_13_296.html","https://web.archive.org/web/20110221195254/http://www.hrvatske-ceste.hr/WEB%20-%20Legislativa/brojenje-prometa/CroDig2009.pdf","http://www.hrvatske-ceste.hr/WEB%20-%20Legislativa/brojenje-prometa/CroDig2009.pdf","https://web.archive.org/web/20090115220041/http://www.javno.com/en/croatia/clanak.php?id=38990","http://www.javno.com/en/croatia/clanak.php?id=38990","https://www.aljazeera.com/news/2022/7/26/croatia-opens-long-awaited-bridge-bypassing-bosnia","https://web.archive.org/web/20110715203314/http://www.agencija-zolpp.hr/Brodskelinije/tabid/1267/Default.aspx","http://www.agencija-zolpp.hr/Brodskelinije/tabid/1267/Default.aspx","http://www.janaf.hr/index.php?option=sustav&lang=en","https://web.archive.org/web/20180807185806/https://ourworldindata.org/grapher/children-born-per-woman?year=1800&country=AUT","https://ourworldindata.org/grapher/children-born-per-woman?year=1800&country=AUT","https://www.euronews.com/2022/01/14/croatia-s-population-has-dropped-10-in-a-decade-reveals-census","http://www.enciklopedija.hr/natuknica.aspx?ID=15884","https://dnevnik.hr/vijesti/hrvatska/hrvatska-fenomen-vise-hrvata-zivi-u-inozemstvu-nego-u-domovini---465670.html","http://www.dzs.hr/Eng/censuses/census2011/results/htm/e01_06_01/E01_06_01.html","http://web.dzs.hr/Eng/censuses/census2011/results/htm/E01_01_10/e01_01_10_RH.html","https://ec.europa.eu/commfrontoffice/publicopinion/archives/ebs/ebs_341_en.pdf","https://ghostarchive.org/archive/20221009/https://ec.europa.eu/commfrontoffice/publicopinion/archives/ebs/ebs_341_en.pdf","https://assets.pewresearch.org/wp-content/uploads/sites/11/2017/05/09154356/Central-and-Eastern-Europe-Topline_FINAL-FOR-PUBLICATION.pdf","https://ghostarchive.org/archive/20221009/http://assets.pewresearch.org/wp-content/uploads/sites/11/2017/05/09154356/Central-and-Eastern-Europe-Topline_FINAL-FOR-PUBLICATION.pdf","http://narodne-novine.nn.hr/clanci/sluzbeni/2010_07_85_2422.html","http://www.vecernji.hr/vijesti/hrvatski-postaje-24-sluzbeni-jezik-europske-unije-clanak-211879","http://www.index.hr/vijesti/clanak/istrazivanje-tri-posto-visokoobrazovanih-ne-zna-niti-jedan-strani-jezik-hrvati-uglavnom-znaju-engleski/545687.aspx","http://ec.europa.eu/public_opinion/archives/ebs/ebs_243_en.pdf","https://ghostarchive.org/archive/20221009/http://ec.europa.eu/public_opinion/archives/ebs/ebs_243_en.pdf","https://europa.eu/european-union/about-eu/countries/member-countries/croatia_en","http://www.dzs.hr/Eng/censuses/census2011/results/htm/e01_01_33/E01_01_33.html","https://www.wipo.int/global_innovation_index/en/2021/","https://www.eib.org/en/stories/coronavirus-infrastructure-investment","https://whc.unesco.org/en/list/810/","https://web.archive.org/web/20111016185426/http://croatia.hr/en-GB/Discover-Croatia/Culture-and-History","http://croatia.hr/en-GB/Discover-Croatia/Culture-and-History","https://ich.unesco.org/en/lists?text=&multinational=3&display1=countryIDs#tabs","https://www.telegraph.co.uk/travel/destinations/europe/croatia/10124483/Varazdin-Croatias-little-Vienna.html","https://ghostarchive.org/archive/20220110/https://www.telegraph.co.uk/travel/destinations/europe/croatia/10124483/Varazdin-Croatias-little-Vienna.html","https://web.archive.org/web/20110721100230/http://www.hart.hr/uploads/documents/354.pdf","http://www.hart.hr/uploads/documents/354.pdf","https://web.archive.org/web/20140324042000/http://www.tzzadar.hr/en/city-guide/historical-monuments/23-05-2007/church-of-saint-donat","http://www.tzzadar.hr/en/city-guide/historical-monuments/23-05-2007/church-of-saint-donat","http://www.krk.hr/en/offer/attractions/the_baska_tablet","http://www.pressreference.com/Co-Fa/Croatia.html","https://rsf.org/en/ranking/2019","https://web.archive.org/web/20111008011534/http://www.eph.hr/eng/products_and_services/index.html","http://www.eph.hr/eng/products_and_services/index.html","https://web.archive.org/web/20110921110603/http://www.styria.com/en/konzernunternehmen/kategorie.php?&cat=1","http://www.styria.com/en/konzernunternehmen/kategorie.php?&cat=1","http://croatia.hr/en-GB/Discover-Croatia/Gastronomy-and-enology","http://www.matica.hr/HRRevija/revija032.nsf/AllWebDocs/skenderovic","http://www.hns-cff.hr/?ln=en&w=o_hns","https://web.archive.org/web/20120121013401/http://www.hoo.hr/en/olimpijske_popis.aspx","http://www.hoo.hr/en/olimpijske_popis.aspx","https://web.archive.org/web/20110704233649/http://www.hoo.hr/en/hoo.aspx","http://www.hoo.hr/en/hoo.aspx","https://hrcak.srce.hr/103223?lang=en","https://archive.org/details/killingtrapgenoc0000midl","https://en.wiktionary.org/wiki/Special:Search/Croatia","https://en.wikinews.org/wiki/Category:Croatia","https://en.wikiquote.org/wiki/Special:Search/Croatia","https://en.wikisource.org/wiki/Special:Search/Croatia","https://en.wikibooks.org/wiki/Special:Search/Croatia","https://en.wikiversity.org/wiki/Special:Search/Croatia","https://en.wikivoyage.org/wiki/Croatia","https://www.openstreetmap.org/relation/214885","https://en.wikipedia.org/w/index.php?title=Template:Croatia_topics&action=edit","https://en.wikipedia.org/w/index.php?title=Template:Sovereign_states_of_Europe&action=edit","https://en.wikipedia.org/w/index.php?title=Template:Countries_and_territories_of_the_Mediterranean_Sea&action=edit","https://en.wikipedia.org/w/index.php?title=Template:Balkan_countries&action=edit","https://en.wikipedia.org/w/index.php?title=Template:Member_states_of_the_European_Union&action=edit","https://en.wikipedia.org/w/index.php?title=Template:Council_of_Europe&action=edit","https://en.wikipedia.org/w/index.php?title=Template:OSCE&action=edit","https://en.wikipedia.org/w/index.php?title=Template:La_Francophonie&action=edit","https://en.wikipedia.org/w/index.php?title=Template:Republics_and_autonomous_provinces_of_the_former_Yugoslavia&action=edit","https://www.wikidata.org/wiki/Q224#identifiers","https://www.worldcat.org/identities/lccn-n81035140/","https://ci.nii.ac.jp/author/DA11951321?l=en","https://en.wikipedia.org/w/index.php?title=Croatia&oldid=1141396181","https://stats.wikimedia.org/#/en.wikipedia.org","https://foundation.wikimedia.org/wiki/Cookie_statement"]

// Function to scrape text from a URL
const scrapeTextFromUrl = async (url) => {
  try {
    const html = await rp(url);
    const $ = cheerio.load(html);
    const text = $('p').text();
    return text;
  } catch (error) {
    console.error(`Error scraping ${url}: ${error}`);
  }
}

// Function to scrape URLs from a URL
const scrapeUrlsFromUrl = async (url) => {
  try {
    const html = await rp(url);
    const $ = cheerio.load(html);
    const links = $('a');
    const urls = [];
    links.each((i, link) => {
      const href = $(link).attr('href');
      if (href && href.startsWith('http') && href.includes('en')) { // && href.includes('en')
        urls.push(href);
      }
    });
    return urls;
  } catch (error) {
    console.error(`Error scraping ${url}: ${error}`);
  }
}

// Function to scrape text and URLs from an array of URLs
const scrapeUrlsAndText = async (urls) => {
  let text = '';
  let allUrls = [urls];
  for (const url of urls) {
    const scrapedText = await scrapeTextFromUrl(url);
    text += scrapedText + '\n\n';
    const scrapedUrls = await scrapeUrlsFromUrl(url);
    allUrls = scrapedUrls;
  }
  return { text, urls: allUrls };
}

// Main function to run the scraping
const scrape = async () => {
  const { text, urls } = await scrapeUrlsAndText(urlsToScrape);
  fs.writeFileSync('./src/text.txt', text.replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
  console.log(`Scraped ${urlsToScrape.length} URLs and saved text to text.txt`);
  console.log(`Found ${urls.length} new URLs to scrape`);
   fs.writeFileSync('./src/urls.txt', JSON.stringify(urls));
  console.log(`Saved new URLs to urls.txt`);
}

// Call the main function to start the scraping
scrape();
  

app.get('/text', (req, res) => {
  try {
    const text = fs.readFileSync('./src/text.txt', 'utf-8');
    res.send(text);
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    res.status(500).send('Error reading file');
  }
});

app.get('/urls', (req, res) => {
  try {
    const text = fs.readFileSync('./src/urls.txt', 'utf-8');
    res.send(text);
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    res.status(500).send('Error reading file');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});