const fs   = require('fs');
const csv  = require('csv-parser');
const ax   = require('axios');
const path = require('path');
const sh   = require('sharp');
const slug = require('slugify');
const HBS  = require('handlebars');

const CSV_FILE = './data.csv';
const OUT_CAT  = '../categories';
const OUT_PROD = '../produits';
const OUT_IMG  = '../assets/images';

// Templates
const TPL_CAT = HBS.compile(fs.readFileSync('tpl-categorie.html','utf8'));
const TPL_PROD= HBS.compile(fs.readFileSync('tpl-produit.html','utf8'));

// dossiers
[OUT_CAT,OUT_PROD,OUT_IMG].forEach(d=>fs.existsSync(d)||fs.mkdirSync(d,{recursive:true}));

fs.createReadStream(CSV_FILE)
  .pipe(csv({separator:';'}))
  .on('data', async (row) => {
     const id   = slug(row.CATEGORIE,{lower:true,strict:true});
     const file = path.join(OUT_IMG,`${id}.jpg`);
     // 1. télécharge image
     if(!fs.existsSync(file)){
       const res = await ax({method:'GET',url:row['LIEN PHOTO ILLUSTRATION'],responseType:'stream'});
       res.data.pipe(fs.createWriteStream(file));
       await sharp(file).resize(800,null,{withoutEnlargement:true}).toFile(path.join(OUT_IMG,`${id}.webp`));
     }
     // 2. produit
     const produit = {
       id, titre:row.CATEGORIE, description:`Promo ${row.CATEGORIE} Amazon`,
       prixBase:'99', prixPromo:'59', remise:'-40 %',
       lienAmazon:row['LIEN PAGE AMAZON'],
       slug:`/produits/${id}`
     };
     fs.writeFileSync(path.join(OUT_PROD,`${id}.html`), TPL_PROD(produit));
     // 3. catégorie (on regroupe ici 1 seul pour l’exemple)
     const categorie = {
       CATEGORIE:row.CATEGORIE,
       produits:[produit]
     };
     fs.writeFileSync(path.join(OUT_CAT,`${id}.html`), TPL_CAT(categorie));
  })
  .on('end',()=>console.log('✅ Génération terminée – uploadez le dossier public_html !'));