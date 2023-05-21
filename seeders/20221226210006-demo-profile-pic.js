"use strict";

/** @type {import('sequelize-cli').Migration} */

const { avatarImgs } = require("../src/helpers/s3FileIds.js");

// const fileName = [
//   "pexels-alina-skazka-16764538.jpg",
//   "pexels-andrea-piacquadio-3937239.jpg",
//   "pexels-andrea-piacquadio-762080.jpg",
//   "pexels-andrea-piacquadio-837358.jpg",
//   "pexels-andrea-piacquadio-845457.jpg",
//   "pexels-andrea-piacquadio-853151.jpg",
//   "pexels-andrea-piacquadio-903171.jpg",
//   "pexels-anton-belitskiy-954623.jpg",
//   "pexels-beyzaa-yurtkuran-16130228.jpg",
//   "pexels-camille-camila-16606773.jpg",
//   "pexels-charles-1851164.jpg",
//   "pexels-daniel-shapiro-16617529.jpg",
//   "pexels-dazzle-jam-1125850.jpg",
//   "pexels-deeana-arts-16848520.jpg",
//   "pexels-dominika-roseclay-2023384.jpg",
//   "pexels-el-gringo-photo-16567147.jpg",
//   "pexels-elina-volkova-16153000.jpg",
//   "pexels-emre-akyol-16822762.jpg",
//   "pexels-eugenia-remark-15737944.jpg",
//   "pexels-fábio-carvalho-6528058.jpg",
//   "pexels-fatih-berat-orer-15694094.jpg",
//   "pexels-fernanda-latronico-713520.jpg",
//   "pexels-furkan-elveren-15308793.jpg",
//   "pexels-hasibullah-zhowandai-819530.jpg",
//   "pexels-henri-mathieusaintlaurent-8349340.jpg",
//   "pexels-josh-hild-16299841.jpg",
//   "pexels-josh-withers-16625615.jpg",
//   "pexels-josue-velasquez-16791418.jpg",
//   "pexels-kaique-rocha-307847.jpg",
//   "pexels-luis-quintero-2257089.jpg",
//   "pexels-mali-maeder-335690.jpg",
//   "pexels-marina-gr-16646619.jpg",
//   "pexels-masi-16789734.jpg",
//   "pexels-matteo-petralli-1818892.jpg",
//   "pexels-mudassir-ali-1657501.jpg",
//   "pexels-nam-quân-nguyễn-16459965.jpg",
//   "pexels-nappy-3097438.jpg",
//   "pexels-nathan-tran-16763928.jpg",
//   "pexels-nitesh-mehera-3249330.jpg",
//   "pexels-ogo-1532939.jpg",
//   "pexels-ömer-çeti̇n-15331170.jpg",
//   "pexels-pixabay-236171.jpg",
//   "pexels-pixabay-247304.jpg",
//   "pexels-pixabay-301952.jpg",
//   "pexels-pixabay-34514.jpg",
//   "pexels-pixabay-39866.jpg",
//   "pexels-q-hưng-phạm-16494849.jpg",
//   "pexels-reead-886285.jpg",
//   "pexels-safari-consoler-16871556.jpg",
//   "pexels-sami-abdullah-15252557.jpg",
//   "pexels-satumbo-16462956.jpg",
//   "pexels-thgusstavo-santana-16271139.jpg",
//   "pexels-throughourlens-mm-15812678 (1).jpg",
//   "pexels-tirachard-kumtanom-601170.jpg",
//   "pexels-tony-s-zohari-16819204.jpg",
//   "pexels-trinity-kubassek-445109.jpg",
//   "pexels-vanessa-garcia-6326195.jpg",
// ];

const profilePics = [];

for (let i = 1; i < 101; i++) {
  profilePics.push({
    mediaFileId: avatarImgs[Math.floor(Math.random() * avatarImgs.length)],
    userId: i,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Profile_pictures", profilePics);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Profile_pictures");
  },
};
