"use strict";

/** @type {import('sequelize-cli').Migration} */

const fileName = [
  "default.png",
  "pexels-alex-azabache-3214968.jpg",
  "pexels-alex-azabache-3757144.jpg",
  "pexels-amine-m'siouri-2245436.jpg",
  "pexels-arthouse-studio-4344260.jpg",
  "pexels-arthouse-studio-4413762.jpg",
  "pexels-artūras-kokorevas-15520825.jpg",
  "pexels-carlo-obrien-15202881.jpg",
  "pexels-david-bartus-586687.jpg",
  "pexels-eberhard-grossgasteiger-12366056 (1).jpg",
  "pexels-edanur-sonkaya-14251082.jpg",
  "pexels-enric-cruz-lópez-6039184.jpg",
  "pexels-esrageziyor-7473041.jpg",
  "pexels-francesco-ungaro-2325446.jpg",
  "pexels-georgios-tsatas-15791536.jpg",
  "pexels-grafixartphoto-samir-belhamra-4254555 (1).jpg",
  "pexels-grafixartphoto-samir-belhamra-4254555.jpg",
  "pexels-jaime-reimer-2662116 (1).jpg",
  "pexels-jaime-reimer-2662116.jpg",
  "pexels-janiere-fernandez-2405101.jpg",
  "pexels-jose-aragones-2179666.jpg",
  "pexels-mateusz-sałaciak-4275885.jpg",
  "pexels-merve-safa-14417229.jpg",
  "pexels-michael-block-3225528.jpg",
  "pexels-michael-block-3225531.jpg",
  "pexels-mirco-violent-blur-4227985.jpg",
  "pexels-morgan-manzoni-12629369.jpg",
  "pexels-nadi-lindsay-5171029.jpg",
  "pexels-nicolas-2925146.jpg",
  "pexels-palu-malerba-2426551.jpg",
  "pexels-philip-warp-6142739.jpg",
  "pexels-philip-warp-6185777.jpg",
  "pexels-pierre-blaché-3369102.jpg",
  "pexels-riccardo-bertolo-4245826.jpg",
  "pexels-roman-odintsov-4553618.jpg",
  "pexels-rüveyda-13733057.jpg",
  "pexels-sake-le-2101528.jpg",
  "pexels-sam-kolder-2387873.jpg",
  "pexels-sheila-731217.jpg",
  "pexels-spencer-davis-4340670.jpg",
  "pexels-spencer-davis-4388167.jpg",
  "pexels-spencer-davis-4388168.jpg",
  "pexels-taryn-elliott-3889660.jpg",
  "pexels-taryn-elliott-3889742.jpg",
  "pexels-taryn-elliott-3889753.jpg",
  "pexels-taryn-elliott-3889764.jpg",
  "pexels-taryn-elliott-3889843.jpg",
  "pexels-taryn-elliott-3889855.jpg",
  "pexels-taryn-elliott-3889986.jpg",
  "pexels-taryn-elliott-3889987.jpg",
  "pexels-te-lensfix-1371360.jpg",
  "pexels-thayná-barsan-16132458.jpg",
  "pexels-vincent-ma-janssen-1310788.jpg",
  "pexels-vincent-rivaud-2265876.jpg",
];

const profilePics = [];

for (let i = 1; i < 101; i++) {
  profilePics.push({
    mediaFileId: fileName[Math.floor(Math.random() * fileName.length)],
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
