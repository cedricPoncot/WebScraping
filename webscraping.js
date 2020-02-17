

//const titre= 'Toward Self-Powered Internet of Underwater Things Devices';
//const titre= 'Spectre Attacks: Exploiting Speculative Execution.';
//Lien recherche DBLP
const lien_barre_recherche= 'https://dblp.uni-trier.de/search?q=';

//Les espaces (tous les espaces et non le premier)
const regex = / /gi;


const puppeteer = require('puppeteer');

const getKeyWord = async (titre) => {
  const browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(lienRecherche(titre));
  console.log('\nRecherche de l\'article : "'+titre+'" effectuée');
  await page.waitFor(2000);
  console.log("\nlien généré :" +lienRecherche(titre));
  //Récupération du doc electronique
  try{
    await page.click(
      '#completesearch-publs>div>ul>li:nth-child(2)>nav>ul>li:nth-child(1)>div.head>a>img'
    )
  }
  catch{
    await browser.close();
    return "NoDocumentAvailable";
  }
  console.log('\nPage Document éléctronique récupéré');
  await page.waitFor(6000);

  //await page.screenshot({path: 'DocElect.png'});
  //let NomPage = document.querySelectorAll('#keywords > xpl-document-keyword-list > section > div > ul > li > ul > li');
  try{
    await page.click(
      //'#document-tabs>div:nth-child(3)>a'
      '#keywords-header'
    )
  }
  catch{
    await browser.close();
    return "Site Non reconnu";
  }
 
  console.log('\nSection "Keywords" atteinte');
  //Pause
  await page.waitFor(2000);
 
  //Récupération des données
  const result = await page.evaluate(() => {
    let baliseKeywords = document.querySelectorAll('#keywords > xpl-document-keyword-list > section > div > ul > li > ul > li');
    let keywords=new Array();
    console.log('\n Nombre de mots clefs : '+baliseKeywords.length);
    for(i=0;i<baliseKeywords.length;i++){
        keywords.push(baliseKeywords[i].innerText);
    }
    
    return keywords;
  })
  //Article hébergé sur IEEE
  //let result= IEEEKeywords(page);
  //Pause
  await page.waitFor(2000);
  //await page.screenshot({path: 'example.png'});

  await browser.close();
  return result;
}

/*
const IEEEKeywords = async (page) => {
  await page.waitFor(1000);
  await page.screenshot({path: 'example2.png'});
  //Clic sur keyword
  await page.click(
    //'#document-tabs>div:nth-child(3)>a'
    '#keywords-header'
  )
 
  console.log('\nSection "Keywords" atteinte');
  //Pause
  await page.waitFor(2000);
 
  //Récupération des données
  return  result = await page.evaluate(() => {
    let baliseKeywords = document.querySelectorAll('#keywords > xpl-document-keyword-list > section > div > ul > li > ul > li');
    let keywords=new Array();
    console.log('\n Nombre de mots clefs : '+baliseKeywords.length);
    for(i=0;i<baliseKeywords.length;i++){
        keywords.push(baliseKeywords[i].innerText);
    }
    
    return keywords;
  })
}

*/
//Création du lien sur le site de DBLP avec la recherche associée au titre.
function lienRecherche (titre){
    chaine=lien_barre_recherche+titre;
    return chaine.replace(regex,'+');
}

//Lecture en asynchrone de chaque titre, et calcul stats
const lectureXML = async (result) => {
  let nbEchec=0;
  let nbReussite=0;
  let nbSiteNonReconnu=0;
  //for(numArticle=0;numArticle<result.dblp.article.length;numArticle++){
  for(numArticle=0;numArticle<5;numArticle++){
    let nombreArticle=numArticle+1;
    let titre=result.dblp.article[numArticle].title;
    console.log(result.dblp.article[numArticle].title);
    //Appel de la fct et récupération des mots clés
    await getKeyWord(titre[0]).then(value=>{
      if(value==="NoDocumentAvailable"){
        nbEchec++;
        console.log("Echec, document non disponible");
      }
      else if(value==="Site Non reconnu"){
        console.log("Echec, site non reconnu");
        nbSiteNonReconnu++;
      }
      else{
        nbReussite++;
        console.log("Succès");
        ajoutStructure(value);

      }
      console.log("Réussite ("+nbReussite+"/"+nombreArticle+") : "+parseInt((nbReussite*1.0/nombreArticle)*100,10)+"%  Site non connu : ("+nbSiteNonReconnu+"/"+nombreArticle+")"+parseInt((nbSiteNonReconnu*1.0/nombreArticle)*100,10)+"% Aucune doc ("+nbEchec+"/"+nombreArticle+"): "+parseInt((nbEchec*1.0/nombreArticle)*100,10)+"%");
    })
   }
  console.log(bd);
}

function ajoutStructure(value){
  for(i=0;i<value.length;i++){
    bd[compteur]={"clé":value[i],"similitude":[{"clé_sim":"C","poids":1}]};
    compteur++;
  }
}

let bd=new Array();
let compteur=0;
//console.log(bd["A"]);
//Main
const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
let xml_string = fs.readFileSync("dblp_echantillon5000.xml", "utf8");
parser.parseString(xml_string, function(error, result) {
  if(error === null) {
      console.log("\nImport XML réussi.");
      lectureXML(result);
  }
  else {
    console.log("error");
      console.log(error);
  }
});


