// ===== KJV BIBLE DATA =====
const KJV_BOOKS = [
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra',
  'Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon',
  'Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos',
  'Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah',
  'Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians',
  '2 Corinthians','Galatians','Ephesians','Philippians','Colossians',
  '1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon',
  'Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'
];

const KJV_CHAPTERS = {
  'Genesis':50,'Exodus':40,'Leviticus':27,'Numbers':36,'Deuteronomy':34,
  'Joshua':24,'Judges':21,'Ruth':4,'1 Samuel':31,'2 Samuel':24,
  '1 Kings':22,'2 Kings':25,'1 Chronicles':29,'2 Chronicles':36,'Ezra':10,
  'Nehemiah':13,'Esther':10,'Job':42,'Psalms':150,'Proverbs':31,
  'Ecclesiastes':12,'Song of Solomon':8,'Isaiah':66,'Jeremiah':52,
  'Lamentations':5,'Ezekiel':48,'Daniel':12,'Hosea':14,'Joel':3,'Amos':9,
  'Obadiah':1,'Jonah':4,'Micah':7,'Nahum':3,'Habakkuk':3,'Zephaniah':3,
  'Haggai':2,'Zechariah':14,'Malachi':4,'Matthew':28,'Mark':16,'Luke':24,
  'John':21,'Acts':28,'Romans':16,'1 Corinthians':16,'2 Corinthians':13,
  'Galatians':6,'Ephesians':6,'Philippians':4,'Colossians':4,
  '1 Thessalonians':5,'2 Thessalonians':3,'1 Timothy':6,'2 Timothy':4,
  'Titus':3,'Philemon':1,'Hebrews':13,'James':5,'1 Peter':5,'2 Peter':3,
  '1 John':5,'2 John':1,'3 John':1,'Jude':1,'Revelation':22
};

// Key KJV passages (complete texts for critical chapters)
const KJV_VERSES = {
  'Genesis':{
    1:[
      {v:1,t:"In the beginning God created the heaven and the earth."},
      {v:2,t:"And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters."},
      {v:3,t:"And God said, Let there be light: and there was light."},
      {v:4,t:"And God saw the light, that it was good: and God divided the light from the darkness."},
      {v:5,t:"And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day."},
      {v:6,t:"And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters."},
      {v:7,t:"And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so."},
      {v:8,t:"And God called the firmament Heaven. And the evening and the morning were the second day."},
      {v:9,t:"And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so."},
      {v:10,t:"And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good."},
      {v:11,t:"And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so."},
      {v:12,t:"And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good."},
      {v:13,t:"And the evening and the morning were the third day."},
      {v:14,t:"And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:"},
      {v:15,t:"And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so."},
      {v:16,t:"And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also."},
      {v:17,t:"And God set them in the firmament of the heaven to give light upon the earth,"},
      {v:18,t:"And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good."},
      {v:19,t:"And the evening and the morning were the fourth day."},
      {v:20,t:"And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven."},
      {v:21,t:"And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good."},
      {v:22,t:"And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth."},
      {v:23,t:"And the evening and the morning were the fifth day."},
      {v:24,t:"And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so."},
      {v:25,t:"And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good."},
      {v:26,t:"And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth."},
      {v:27,t:"So God created man in his own image, in the image of God created he him; male and female created he them."},
      {v:28,t:"And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth."},
      {v:29,t:"And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat."},
      {v:30,t:"And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so."},
      {v:31,t:"And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day."}
    ]
  },
  'Exodus':{
    25:[
      {v:1,t:"And the LORD spake unto Moses, saying,"},
      {v:2,t:"Speak unto the children of Israel, that they bring me an offering: of every man that giveth it willingly with his heart ye shall take my offering."},
      {v:3,t:"And this is the offering which ye shall take of them; gold, and silver, and brass,"},
      {v:4,t:"And blue, and purple, and scarlet, and fine linen, and goats' hair,"},
      {v:5,t:"And rams' skins dyed red, and badgers' skins, and shittim wood,"},
      {v:6,t:"Oil for the light, spices for anointing oil, and for sweet incense,"},
      {v:7,t:"Onyx stones, and stones to be set in the ephod, and in the breastplate."},
      {v:8,t:"And let them make me a sanctuary; that I may dwell among them."},
      {v:9,t:"According to all that I shew thee, after the pattern of the tabernacle, and the pattern of all the instruments thereof, even so shall ye make it."},
      {v:10,t:"And they shall make an ark of shittim wood: two cubits and a half shall be the length thereof, and a cubit and a half the breadth thereof, and a cubit and a half the height thereof."},
      {v:11,t:"And thou shalt overlay it with pure gold, within and without shalt thou overlay it, and shalt make upon it a crown of gold round about."},
      {v:12,t:"And thou shalt cast four rings of gold for it, and put them in the four corners thereof; and two rings shall be in the one side of it, and two rings in the other side of it."},
      {v:13,t:"And thou shalt make staves of shittim wood, and overlay them with gold."},
      {v:14,t:"And thou shalt put the staves into the rings by the sides of the ark, that the ark may be borne with them."},
      {v:15,t:"The staves shall be in the rings of the ark: they shall not be taken from it."},
      {v:16,t:"And thou shalt put into the ark the testimony which I shall give thee."},
      {v:17,t:"And thou shalt make a mercy seat of pure gold: two cubits and a half shall be the length thereof, and a cubit and a half the breadth thereof."},
      {v:18,t:"And thou shalt make two cherubims of gold, of beaten work shalt thou make them, in the two ends of the mercy seat."},
      {v:19,t:"And make one cherub on the one end, and the other cherub on the other end: even of the mercy seat shall ye make the cherubims on the two ends thereof."},
      {v:20,t:"And the cherubims shall stretch forth their wings on high, covering the mercy seat with their wings, and their faces shall look one to another; toward the mercy seat shall the faces of the cherubims be."},
      {v:21,t:"And thou shalt put the mercy seat above upon the ark; and in the ark thou shalt put the testimony that I shall give thee."},
      {v:22,t:"And there I will meet with thee, and I will commune with thee from above the mercy seat, from between the two cherubims which are upon the ark of the testimony, of all things which I will give thee in commandment unto the children of Israel."},
      {v:23,t:"Thou shalt also make a table of shittim wood: two cubits shall be the length thereof, and a cubit the breadth thereof, and a cubit and a half the height thereof."},
      {v:24,t:"And thou shalt overlay it with pure gold, and make thereto a crown of gold round about."},
      {v:30,t:"And thou shalt set upon the table shewbread before me alway."},
      {v:31,t:"And thou shalt make a candlestick of pure gold: of beaten work shall the candlestick be made: his shaft, and his branches, his bowls, his knops, and his flowers, shall be of the same."},
      {v:40,t:"And look that thou make them after their pattern, which was shewed thee in the mount."}
    ],
    40:[
      {v:1,t:"And the LORD spake unto Moses, saying,"},
      {v:2,t:"On the first day of the first month shalt thou set up the tabernacle of the tent of the congregation."},
      {v:34,t:"Then a cloud covered the tent of the congregation, and the glory of the LORD filled the tabernacle."},
      {v:35,t:"And Moses was not able to enter into the tent of the congregation, because the cloud abode thereon, and the glory of the LORD filled the tabernacle."},
      {v:38,t:"For the cloud of the LORD was upon the tabernacle by day, and fire was on it by night, in the sight of all the house of Israel, throughout all their journeys."}
    ]
  },
  'Leviticus':{
    16:[
      {v:1,t:"And the LORD spake unto Moses after the death of the two sons of Aaron, when they offered before the LORD, and died;"},
      {v:2,t:"And the LORD said unto Moses, Speak unto Aaron thy brother, that he come not at all times into the holy place within the vail before the mercy seat, which is upon the ark; that he die not: for I will appear in the cloud upon the mercy seat."},
      {v:3,t:"Thus shall Aaron come into the holy place: with a young bullock for a sin offering, and a ram for a burnt offering."},
      {v:4,t:"He shall put on the holy linen coat, and he shall have the linen breeches upon his flesh, and shall be girded with a linen girdle, and with the linen mitre shall he be attired: these are holy garments; therefore shall he wash his flesh in water, and so put them on."},
      {v:5,t:"And he shall take of the congregation of the children of Israel two kids of the goats for a sin offering, and one ram for a burnt offering."},
      {v:6,t:"And Aaron shall offer his bullock of the sin offering, which is for himself, and make an atonement for himself, and for his house."},
      {v:7,t:"And he shall take the two goats, and present them before the LORD at the door of the tabernacle of the congregation."},
      {v:8,t:"And Aaron shall cast lots upon the two goats; one lot for the LORD, and the other lot for the scapegoat."},
      {v:9,t:"And Aaron shall bring the goat upon which the LORD's lot fell, and offer him for a sin offering."},
      {v:10,t:"But the goat, on which the lot fell to be the scapegoat, shall be presented alive before the LORD, to make an atonement with him, and to let him go for a scapegoat into the wilderness."},
      {v:11,t:"And Aaron shall bring the bullock of the sin offering, which is for himself, and shall make an atonement for himself, and for his house, and shall kill the bullock of the sin offering which is for himself:"},
      {v:12,t:"And he shall take a censer full of burning coals of fire from off the altar before the LORD, and his hands full of sweet incense beaten small, and bring it within the vail:"},
      {v:13,t:"And he shall put the incense upon the fire before the LORD, that the cloud of the incense may cover the mercy seat that is upon the testimony, that he die not:"},
      {v:14,t:"And he shall take of the blood of the bullock, and sprinkle it with his finger upon the mercy seat eastward; and before the mercy seat shall he sprinkle of the blood with his finger seven times."},
      {v:15,t:"Then shall he kill the goat of the sin offering, that is for the people, and bring his blood within the vail, and do with that blood as he did with the blood of the bullock, and sprinkle it upon the mercy seat, and before the mercy seat:"},
      {v:16,t:"And he shall make an atonement for the holy place, because of the uncleanness of the children of Israel, and because of their transgressions in all their sins: and so shall he do for the tabernacle of the congregation, that remaineth among them in the midst of their uncleanness."},
      {v:20,t:"And when he hath made an end of reconciling the holy place, and the tabernacle of the congregation, and the altar, he shall bring the live goat:"},
      {v:21,t:"And Aaron shall lay both his hands upon the head of the live goat, and confess over him all the iniquities of the children of Israel, and all their transgressions in all their sins, putting them upon the head of the goat, and shall send him away by the hand of a fit man into the wilderness:"},
      {v:22,t:"And the goat shall bear upon him all their iniquities unto a land not inhabited: and he shall let go the goat in the wilderness."},
      {v:29,t:"And this shall be a statute for ever unto you: that in the seventh month, on the tenth day of the month, ye shall afflict your souls, and do no work at all, whether it be one of your own country, or a stranger that sojourneth among you:"},
      {v:30,t:"For on that day shall the priest make an atonement for you, to cleanse you, that ye may be clean from all your sins before the LORD."},
      {v:34,t:"And this shall be an everlasting statute unto you, to make an atonement for the children of Israel for all their sins once a year. And he did as the LORD commanded Moses."}
    ]
  },
  'Daniel':{
    7:[
      {v:1,t:"In the first year of Belshazzar king of Babylon Daniel had a dream and visions of his head upon his bed: then he wrote the dream, and told the sum of the matters."},
      {v:2,t:"Daniel spake and said, I saw in my vision by night, and, behold, the four winds of the heaven strove upon the great sea."},
      {v:3,t:"And four great beasts came up from the sea, diverse one from another."},
      {v:7,t:"After this I saw in the night visions, and behold a fourth beast, dreadful and terrible, and strong exceedingly; and it had great iron teeth: it devoured and brake in pieces, and stamped the residue with the feet of it: and it was diverse from all the beasts that were before it; and it had ten horns."},
      {v:8,t:"I considered the horns, and, behold, there came up among them another little horn, before whom there were three of the first horns plucked up by the roots: and, behold, in this horn were eyes like the eyes of man, and a mouth speaking great things."},
      {v:9,t:"I beheld till the thrones were cast down, and the Ancient of days did sit, whose garment was white as snow, and the hair of his head like the pure wool: his throne was like the fiery flame, and his wheels as burning fire."},
      {v:10,t:"A fiery stream issued and came forth from before him: thousand thousands ministered unto him, and ten thousand times ten thousand stood before him: the judgment was set, and the books were opened."},
      {v:13,t:"I saw in the night visions, and, behold, one like the Son of man came with the clouds of heaven, and came to the Ancient of days, and they brought him near before him."},
      {v:14,t:"And there was given him dominion, and glory, and a kingdom, that all people, nations, and languages, should serve him: his dominion is an everlasting dominion, which shall not pass away, and his kingdom that which shall not be destroyed."},
      {v:25,t:"And he shall speak great words against the most High, and shall wear out the saints of the most High, and think to change times and laws: and they shall be given into his hand until a time and times and the dividing of time."},
      {v:26,t:"But the judgment shall sit, and they shall take away his dominion, to consume and to destroy it unto the end."},
      {v:27,t:"And the kingdom and dominion, and the greatness of the kingdom under the whole heaven, shall be given to the people of the saints of the most High, whose kingdom is an everlasting kingdom, and all dominions shall serve and obey him."}
    ],
    8:[
      {v:1,t:"In the third year of the reign of king Belshazzar a vision appeared unto me, even unto me Daniel, after that which appeared unto me at the first."},
      {v:9,t:"And out of one of them came forth a little horn, which waxed exceeding great, toward the south, and toward the east, and toward the pleasant land."},
      {v:10,t:"And it waxed great, even to the host of heaven; and it cast down some of the host and of the stars to the ground, and stamped upon them."},
      {v:11,t:"Yea, he magnified himself even to the prince of the host, and by him the daily sacrifice was taken away, and the place of his sanctuary was cast down."},
      {v:12,t:"And an host was given him against the daily sacrifice by reason of transgression, and it cast down the truth to the ground; and it practised, and prospered."},
      {v:13,t:"Then I heard one saint speaking, and another saint said unto that certain saint which spake, How long shall be the vision concerning the daily sacrifice, and the transgression of desolation, to give both the sanctuary and the host to be trodden under foot?"},
      {v:14,t:"And he said unto me, Unto two thousand and three hundred days; then shall the sanctuary be cleansed."},
      {v:17,t:"So he came near where I stood: and when he came, I was afraid, and fell upon my face: but he said unto me, Understand, O son of man: for at the time of the end shall be the vision."},
      {v:25,t:"And through his policy also he shall cause craft to prosper in his hand; and he shall magnify himself in his heart, and by peace shall destroy many: he shall also stand up against the Prince of princes; but he shall be broken without hand."}
    ],
    9:[
      {v:1,t:"In the first year of Darius the son of Ahasuerus, of the seed of the Medes, which was made king over the realm of the Chaldeans;"},
      {v:2,t:"In the first year of his reign I Daniel understood by books the number of the years, whereof the word of the LORD came to Jeremiah the prophet, that he would accomplish seventy years in the desolations of Jerusalem."},
      {v:3,t:"And I set my face unto the Lord God, to seek by prayer and supplications, with fasting, and sackcloth, and ashes:"},
      {v:24,t:"Seventy weeks are determined upon thy people and upon thy holy city, to finish the transgression, and to make an end of sins, and to make reconciliation for iniquity, and to bring in everlasting righteousness, and to seal up the vision and prophecy, and to anoint the most Holy."},
      {v:25,t:"Know therefore and understand, that from the going forth of the commandment to restore and to build Jerusalem unto the Messiah the Prince shall be seven weeks, and threescore and two weeks: the street shall be built again, and the wall, even in troublous times."},
      {v:26,t:"And after threescore and two weeks shall Messiah be cut off, but not for himself: and the people of the prince that shall come shall destroy the city and the sanctuary; and the end thereof shall be with a flood, and unto the end of the war desolations are determined."},
      {v:27,t:"And he shall confirm the covenant with many for one week: and in the midst of the week he shall cause the sacrifice and the oblation to cease, and for the overspreading of abominations he shall make it desolate, even until the consummation, and that determined shall be poured upon the desolate."}
    ]
  },
  'Hebrews':{
    1:[
      {v:1,t:"God, who at sundry times and in divers manners spake in time past unto the fathers by the prophets,"},
      {v:2,t:"Hath in these last days spoken unto us by his Son, whom he hath appointed heir of all things, by whom also he made the worlds;"},
      {v:3,t:"Who being the brightness of his glory, and the express image of his person, and upholding all things by the word of his power, when he had by himself purged our sins, sat down on the right hand of the Majesty on high;"},
      {v:4,t:"Being made so much better than the angels, as he hath by inheritance obtained a more excellent name than they."},
      {v:8,t:"But unto the Son he saith, Thy throne, O God, is for ever and ever: a sceptre of righteousness is the sceptre of thy kingdom."}
    ],
    4:[
      {v:14,t:"Seeing then that we have a great high priest, that is passed into the heavens, Jesus the Son of God, let us hold fast our profession."},
      {v:15,t:"For we have not an high priest which cannot be touched with the feeling of our infirmities; but was in all points tempted like as we are, yet without sin."},
      {v:16,t:"Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need."}
    ],
    8:[
      {v:1,t:"Now of the things which we have spoken this is the sum: We have such an high priest, who is set on the right hand of the throne of the Majesty in the heavens;"},
      {v:2,t:"A minister of the sanctuary, and of the true tabernacle, which the Lord pitched, and not man."},
      {v:3,t:"For every high priest is ordained to offer gifts and sacrifices: wherefore it is of necessity that this man have somewhat also to offer."},
      {v:4,t:"For if he were on earth, he should not be a priest, seeing that there are priests that offer gifts according to the law:"},
      {v:5,t:"Who serve unto the example and shadow of heavenly things, as Moses was admonished of God when he was about to make the tabernacle: for, See, saith he, that thou make all things according to the pattern shewed to thee in the mount."},
      {v:6,t:"But now hath he obtained a more excellent ministry, by how much also he is the mediator of a better covenant, which was established upon better promises."},
      {v:13,t:"In that he saith, A new covenant, he hath made the first old. Now that which decayeth and waxeth old is ready to vanish away."}
    ],
    9:[
      {v:1,t:"Then verily the first covenant had also ordinances of divine service, and a worldly sanctuary."},
      {v:2,t:"For there was a tabernacle made; the first, wherein was the candlestick, and the table, and the shewbread; which is called the sanctuary."},
      {v:3,t:"And after the second veil, the tabernacle which is called the Holiest of all;"},
      {v:4,t:"Which had the golden censer, and the ark of the covenant overlaid round about with gold, wherein was the golden pot that had manna, and Aaron's rod that budded, and the tables of the covenant;"},
      {v:5,t:"And over it the cherubims of glory shadowing the mercyseat; of which we cannot now speak particularly."},
      {v:7,t:"But into the second went the high priest alone once every year, not without blood, which he offered for himself, and for the errors of the people:"},
      {v:8,t:"The Holy Ghost this signifying, that the way into the holiest of all was not yet made manifest, while as the first tabernacle was yet standing:"},
      {v:11,t:"But Christ being come an high priest of good things to come, by a greater and more perfect tabernacle, not made with hands, that is to say, not of this building;"},
      {v:12,t:"Neither by the blood of goats and calves, but by his own blood he entered in once into the holy place, having obtained eternal redemption for us."},
      {v:13,t:"For if the blood of bulls and of goats, and the ashes of an heifer sprinkling the unclean, sanctifieth to the purifying of the flesh:"},
      {v:14,t:"How much more shall the blood of Christ, who through the eternal Spirit offered himself without spot to God, purge your conscience from dead works to serve the living God?"},
      {v:22,t:"And almost all things are by the law purged with blood; and without shedding of blood is no remission."},
      {v:23,t:"It was therefore necessary that the patterns of things in the heavens should be purified with these; but the heavenly things themselves with better sacrifices than these."},
      {v:24,t:"For Christ is not entered into the holy places made with hands, which are the figures of the true; but into heaven itself, now to appear in the presence of God for us:"},
      {v:25,t:"Nor yet that he should offer himself often, as the high priest entereth into the holy place every year with blood of others;"},
      {v:26,t:"For then must he often have suffered since the foundation of the world: but now once in the end of the world hath he appeared to put away sin by the sacrifice of himself."},
      {v:27,t:"And as it is appointed unto men once to die, but after this the judgment:"},
      {v:28,t:"So Christ was once offered to bear the sins of many; and unto them that look for him shall he appear the second time without sin unto salvation."}
    ],
    10:[
      {v:1,t:"For the law having a shadow of good things to come, and not the very image of the things, can never with those sacrifices which they offered year by year continually make the comers thereunto perfect."},
      {v:4,t:"For it is not possible that the blood of bulls and of goats should take away sins."},
      {v:10,t:"By the which will we are sanctified through the offering of the body of Jesus Christ once for all."},
      {v:12,t:"But this man, after he had offered one sacrifice for sins for ever, sat down on the right hand of God;"},
      {v:14,t:"For by one offering he hath perfected for ever them that are sanctified."},
      {v:19,t:"Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus,"},
      {v:20,t:"By a new and living way, which he hath consecrated for us, through the veil, that is to say, his flesh;"},
      {v:21,t:"And having an high priest over the house of God;"},
      {v:22,t:"Let us draw near with a true heart in full assurance of faith, having our hearts sprinkled from an evil conscience, and our bodies washed with pure water."}
    ]
  },
  'Revelation':{
    4:[
      {v:1,t:"After this I looked, and, behold, a door was opened in heaven: and the first voice which I heard was as it were of a trumpet talking with me; which said, Come up hither, and I will shew thee things which must be hereafter."},
      {v:2,t:"And immediately I was in the spirit: and, behold, a throne was set in heaven, and one sat on the throne."},
      {v:3,t:"And he that sat was to look upon like a jasper and a sardine stone: and there was a rainbow round about the throne, in sight like unto an emerald."},
      {v:4,t:"And round about the throne were four and twenty seats: and upon the seats I saw four and twenty elders sitting, clothed in white raiment; and they had on their heads crowns of gold."},
      {v:5,t:"And out of the throne proceeded lightnings and thunderings and voices: and there were seven lamps of fire burning before the throne, which are the seven Spirits of God."},
      {v:6,t:"And before the throne there was a sea of glass like unto crystal: and in the midst of the throne, and round about the throne, were four beasts full of eyes before and behind."},
      {v:11,t:"Thou art worthy, O Lord, to receive glory and honour and power: for thou hast created all things, and for thy pleasure they are and were created."}
    ],
    5:[
      {v:5,t:"And one of the elders saith unto me, Weep not: behold, the Lion of the tribe of Juda, the Root of David, hath prevailed to open the book, and to loose the seven seals thereof."},
      {v:6,t:"And I beheld, and, lo, in the midst of the throne and of the four beasts, and in the midst of the elders, stood a Lamb as it had been slain, having seven horns and seven eyes, which are the seven Spirits of God sent forth into all the earth."},
      {v:8,t:"And when he had taken the book, the four beasts and four and twenty elders fell down before the Lamb, having every one of them harps, and golden vials full of odours, which are the prayers of saints."},
      {v:9,t:"And they sung a new song, saying, Thou art worthy to take the book, and to open the seals thereof: for thou wast slain, and hast redeemed us to God by thy blood out of every kindred, and tongue, and people, and nation;"},
      {v:12,t:"Saying with a loud voice, Worthy is the Lamb that was slain to receive power, and riches, and wisdom, and strength, and honour, and glory, and blessing."}
    ],
    11:[
      {v:19,t:"And the temple of God was opened in heaven, and there was seen in his temple the ark of his testament: and there were lightnings, and voices, and thunderings, and an earthquake, and great hail."}
    ],
    14:[
      {v:6,t:"And I saw another angel fly in the midst of heaven, having the everlasting gospel to preach unto them that dwell on the earth, and to every nation, and kindred, and tongue, and people,"},
      {v:7,t:"Saying with a loud voice, Fear God, and give glory to him; for the hour of his judgment is come: and worship him that made heaven, and earth, and the sea, and the fountains of waters."}
    ]
  },
  'John':{
    1:[
      {v:1,t:"In the beginning was the Word, and the Word was with God, and the Word was God."},
      {v:2,t:"The same was in the beginning with God."},
      {v:3,t:"All things were made by him; and without him was not any thing made that was made."},
      {v:4,t:"In him was life; and the life was the light of men."},
      {v:14,t:"And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth."},
      {v:29,t:"The next day John seeth Jesus coming unto him, and saith, Behold the Lamb of God, which taketh away the sin of the world."}
    ],
    3:[
      {v:16,t:"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."},
      {v:17,t:"For God sent not his Son into the world to condemn the world; but that the world through him might be saved."}
    ]
  },
  'Romans':{
    3:[
      {v:23,t:"For all have sinned, and come short of the glory of God;"},
      {v:24,t:"Being justified freely by his grace through the redemption that is in Christ Jesus:"},
      {v:25,t:"Whom God hath set forth to be a propitiation through faith in his blood, to declare his righteousness for the remission of sins that are past, through the forbearance of God;"}
    ],
    8:[
      {v:1,t:"There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit."},
      {v:34,t:"Who is he that condemneth? It is Christ that died, yea rather, that is risen again, who is even at the right hand of God, who also maketh intercession for us."}
    ]
  },
  'Ephesians':{
    2:[
      {v:8,t:"For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:"},
      {v:9,t:"Not of works, lest any man should boast."},
      {v:10,t:"For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them."}
    ]
  },
  'Psalms':{
    23:[
      {v:1,t:"The LORD is my shepherd; I shall not want."},
      {v:2,t:"He maketh me to lie down in green pastures: he leadeth me beside the still waters."},
      {v:3,t:"He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake."},
      {v:4,t:"Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me."},
      {v:5,t:"Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over."},
      {v:6,t:"Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever."}
    ],
    91:[
      {v:1,t:"He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty."},
      {v:2,t:"I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust."},
      {v:11,t:"For he shall give his angels charge over thee, to keep thee in all thy ways."}
    ]
  },
  'Matthew':{
    5:[
      {v:1,t:"And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:"},
      {v:2,t:"And he opened his mouth, and taught them, saying,"},
      {v:3,t:"Blessed are the poor in spirit: for theirs is the kingdom of heaven."},
      {v:4,t:"Blessed are they that mourn: for they shall be comforted."},
      {v:5,t:"Blessed are the meek: for they shall inherit the earth."},
      {v:6,t:"Blessed are they which do hunger and thirst after righteousness: for they shall be filled."},
      {v:7,t:"Blessed are the merciful: for they shall obtain mercy."},
      {v:8,t:"Blessed are the pure in heart: for they shall see God."},
      {v:9,t:"Blessed are the peacemakers: for they shall be called the children of God."},
      {v:14,t:"Ye are the light of the world. A city that is set on an hill cannot be hid."},
      {v:17,t:"Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil."}
    ],
    27:[
      {v:51,t:"And, behold, the veil of the temple was rent in twain from the top to the bottom; and the earth did quake, and the rocks rent;"},
      {v:52,t:"And the graves were opened; and many bodies of the saints which slept arose,"}
    ]
  },
  '1 Kings':{
    6:[
      {v:1,t:"And it came to pass in the four hundred and eightieth year after the children of Israel were come out of the land of Egypt, in the fourth year of Solomon's reign over Israel, in the month Zif, which is the second month, that he began to build the house of the LORD."},
      {v:2,t:"And the house which king Solomon built for the LORD, the length thereof was threescore cubits, and the breadth thereof twenty cubits, and the height thereof thirty cubits."},
      {v:3,t:"And the porch before the temple of the house, twenty cubits was the length thereof, according to the breadth of the house; and ten cubits was the breadth thereof before the house."},
      {v:12,t:"Concerning this house which thou art in building, if thou wilt walk in my statutes, and execute my judgments, and keep all my commandments to walk in them; then will I perform my word with thee, which I spake unto David thy father:"},
      {v:13,t:"And I will dwell among the children of Israel, and will not forsake my people Israel."},
      {v:38,t:"And in the eleventh year, in the month Bul, which is the eighth month, was the house finished throughout all the parts thereof, and according to all the fashion of it. So was he seven years in building it."}
    ]
  }
};

// ===== CROSS REFERENCES =====
const CROSS_REFS = {
  'Genesis 1': ['John 1:1-3','Hebrews 11:3','Colossians 1:16','Revelation 4:11'],
  'Exodus 25': ['Hebrews 8:1-5','Hebrews 9:1-5','Revelation 11:19'],
  'Leviticus 16': ['Hebrews 9:7','Hebrews 9:23-28','Romans 3:25'],
  'Daniel 8': ['Daniel 9:24-27','Revelation 14:6-7','Hebrews 9:23'],
  'Hebrews 9': ['Leviticus 16','Exodus 25-26','Romans 3:23-25'],
  'Revelation 4': ['Ezekiel 1:22-26','Isaiah 6:1-4','Daniel 7:9-10']
};

const STUDY_NOTES = {
  'Genesis 1': 'The Hebrew word "bara" (create) indicates creation ex nihilo. The sevenfold repetition of "and God saw that it was good" emphasizes divine approval. The Sabbath completion in verse 31 sets the pattern for sacred time.',
  'Exodus 25': 'The sanctuary construction begins with the Ark — the most sacred object — and moves outward. "According to the pattern" (v.9) indicates the heavenly sanctuary preceded the earthly (Heb 8:5). The mercy seat (kapporeth) relates to atonement (kippur).',
  'Leviticus 16': 'The Day of Atonement (Yom Kippur) is the most solemn day of the Hebrew year. The two goats represent two aspects of atonement: the LORD\'s goat (Christ\'s sacrifice) and the scapegoat (Azazel — Satan bearing responsibility for sin).',
  'Daniel 8': 'The 2,300 evenings and mornings, interpreted by the year-day principle (Num 14:34; Eze 4:6), extend from 457 BC to 1844 AD. This is the longest prophetic period in Scripture, pointing to the heavenly sanctuary\'s cleansing.',
  'Hebrews 9': 'The author systematically shows how the earthly sanctuary was a copy (Gr. hupodeigma — example/shadow) of the heavenly. Christ\'s blood is superior to animal blood, accomplishing eternal redemption rather than annual temporary covering.',
  'Revelation 4': 'This throne-room vision parallels Daniel 7:9-14. The 24 elders likely represent redeemed humanity. The seven lamps are the seven Spirits of God (the Holy Spirit in fullness). This is the heavenly sanctuary in its fullness.'
};

// ===== TIMELINE STEPS =====
const TIMELINE_STEPS = [
  {step:0, aaron:"Aaron comes through the gate to work in the morning", jesus:"Jesus is born into this world of sinful human flesh", aaronRef:"Leviticus 16:3 — Thus shall Aaron come into the holy place: with a young bullock for a sin offering, and a ram for a burnt offering.", jesusRef:"Matthew 1:21 — And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins. John 1:14 — And the Word was made flesh, and dwelt among us.", desc:"Entrance into the work of Salvation: Aaron begins daily service; Christ enters humanity through the incarnation."},
  {step:1, aaron:"Washes body and puts on common priest's clothes", jesus:"Baptism by John at the river Jordan", aaronRef:"Leviticus 16:4 — He shall put on the holy linen coat, and he shall have the linen breeches upon his flesh, and shall be girded with a linen girdle, and with the linen mitre shall he be attired: these are holy garments; therefore shall he wash his flesh in water, and so put them on.", jesusRef:"Matthew 3:13-17 — Then cometh Jesus from Galilee to Jordan unto John, to be baptized of him... and lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased.", desc:"Consecration and preparation for ministry."},
  {step:2, aaron:"Kills bull for himself and his household", jesus:"Crucifixion — the ultimate sacrifice for all", aaronRef:"Leviticus 16:6,11 — And Aaron shall offer his bullock of the sin offering, which is for himself, and make an atonement for himself, and for his house.", jesusRef:"Hebrews 7:27 — Who needeth not daily, as those high priests, to offer up sacrifice, first for his own sins, and then for the people's: for this he did once, when he offered up himself.", desc:"Atonement provision: Aaron needs covering; Christ provides the ultimate sacrifice once for all."},
  {step:3, aaron:"Washes hands and feet at the laver", jesus:"Resurrection — removes traces of sin and death", aaronRef:"Exodus 30:18-21 — Thou shalt also make a laver of brass... Aaron and his sons shall wash their hands and their feet thereat: When they go into the tabernacle of the congregation, they shall wash with water, that they die not.", jesusRef:"Romans 6:9-10 — Knowing that Christ being raised from the dead dieth no more; death hath no more dominion over him. For in that he died, he died unto sin once: but in that he liveth, he liveth unto God.", desc:"Purity emphasized; Christ's resurrection demonstrates victory over sin and death."},
  {step:4, aaron:"Picks up incense and censer of burning coals", jesus:"Ascension — passed into the heavens with His own merits", aaronRef:"Leviticus 16:12-13 — And he shall take a censer full of burning coals of fire from off the altar before the LORD, and his hands full of sweet incense beaten small, and bring it within the vail.", jesusRef:"Hebrews 9:11-12 — But Christ being come an high priest of good things to come, by a greater and more perfect tabernacle, not made with hands... by his own blood he entered in once into the holy place, having obtained eternal redemption for us.", desc:"Intercession initiates: Aaron's incense typifies Christ's merits presented before the Father."},
  {step:5, aaron:"Enters Most Holy Place; sprinkles blood of bullock on mercy seat", jesus:"Jesus presents His blood before the Father; accepted", aaronRef:"Leviticus 16:14 — And he shall take of the blood of the bullock, and sprinkle it with his finger upon the mercy seat eastward; and before the mercy seat shall he sprinkle of the blood with his finger seven times.", jesusRef:"Hebrews 9:12 — Neither by the blood of goats and calves, but by his own blood he entered in once into the holy place, having obtained eternal redemption for us.", desc:"The blood is presented — forgiveness and acceptance secured through the superior sacrifice."},
  {step:6, aaron:"Kills goat for sin offering of the people", jesus:"Intercession for the saints — ongoing mediation", aaronRef:"Leviticus 16:15 — Then shall he kill the goat of the sin offering, that is for the people, and bring his blood within the vail.", jesusRef:"Romans 8:34 — It is Christ that died, yea rather, that is risen again, who is even at the right hand of God, who also maketh intercession for us.", desc:"Christ's ongoing intercession covers the sins confessed and repented of by believers."},
  {step:7, aaron:"Sprinkles blood of goat seven times before mercy seat", jesus:"Christ pleads the merits of His blood for each believer", aaronRef:"Leviticus 16:15 — ...and do with that blood as he did with the blood of the bullock, and sprinkle it upon the mercy seat, and before the mercy seat.", jesusRef:"Hebrews 4:16 — Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.", desc:"Complete cleansing — the seven sprinklings indicate totality and completeness of the atonement."},
  {step:8, aaron:"Puts blood on golden altar of incense", jesus:"Christ's intercession extends to His church", aaronRef:"Leviticus 16:18-19 — And he shall go out unto the altar that is before the LORD, and make an atonement for it; and shall take of the blood of the bullock, and of the blood of the goat, and put it upon the horns of the altar round about.", jesusRef:"Hebrews 7:25 — Wherefore he is able also to save them to the uttermost that come unto God by him, seeing he ever liveth to make intercession for them.", desc:"The intercession is comprehensive — covering the entire community of faith."},
  {step:9, aaron:"Brings the live goat and confesses all iniquities upon it", jesus:"At end of judgment, iniquities transferred to Satan (Azazel)", aaronRef:"Leviticus 16:21 — And Aaron shall lay both his hands upon the head of the live goat, and confess over him all the iniquities of the children of Israel, and all their transgressions in all their sins.", jesusRef:"Revelation 20:2 — And he laid hold on the dragon, that old serpent, which is the Devil, and Satan, and bound him a thousand years. (The scapegoat typifies this final transfer of guilt to its originator.)", desc:"The scapegoat represents Satan bearing ultimate responsibility for tempting humanity to sin."},
  {step:10, aaron:"Sends the scapegoat into the wilderness", jesus:"Satan bound during millennium; cast into lake of fire", aaronRef:"Leviticus 16:22 — And the goat shall bear upon him all their iniquities unto a land not inhabited: and he shall let go the goat in the wilderness.", jesusRef:"Revelation 20:10 — And the devil that deceived them was cast into the lake of fire and brimstone, where the beast and the false prophet are, and shall be tormented day and night for ever and ever.", desc:"Final disposition of sin and its originator — complete eradication of evil from the universe."},
  {step:11, aaron:"Changes back into his priestly garments", jesus:"Christ returns in glory — Second Advent", aaronRef:"Leviticus 16:23-24 — And Aaron shall come into the tabernacle of the congregation, and shall put off the linen garments, which he put on when he went into the holy place, and shall leave them there: And he shall wash his flesh with water in a holy place, and put on his garments.", jesusRef:"Revelation 19:11-16 — And I saw heaven opened, and behold a white horse; and he that sat upon him was called Faithful and True... And he hath on his vesture and on his thigh a name written, KING OF KINGS, AND LORD OF LORDS.", desc:"Christ returns not as the sacrificed lamb but as the victorious King of Kings."},
  {step:12, aaron:"Offers burnt offering for himself and the people", jesus:"Presents the redeemed before the Father at the end", aaronRef:"Leviticus 16:24 — And he shall wash his flesh with water in a holy place, and put on his garments, and come forth, and offer his burnt offering, and the burnt offering of the people, and make an atonement for himself, and for the people.", jesusRef:"John 17:24 — Father, I will that they also, whom thou hast given me, be with me where I am; that they may behold my glory. Jude 24 — Now unto him that is able to keep you from falling, and to present you faultless before the presence of his glory with exceeding joy.", desc:"The redeemed are presented before the Father — the climax of the plan of salvation."},
  {step:13, aaron:"The people rejoice — atonement complete", jesus:"Eternity begins — God dwells with His people forever", aaronRef:"Leviticus 16:30 — For on that day shall the priest make an atonement for you, to cleanse you, that ye may be clean from all your sins before the LORD.", jesusRef:"Revelation 21:3-4 — And I heard a great voice out of heaven saying, Behold, the tabernacle of God is with men, and he will dwell with them, and they shall be his people... And God shall wipe away all tears from their eyes; and there shall be no more death.", desc:"The great controversy ends. God's character is vindicated and the redeemed dwell with Him forever."}
];

// ===== SACRED COLORS =====
const SACRED_COLORS = [
  {id:'blue', name:'Blue', hex:'#3b6ea8', hebrewWord:'tekeleth (תְּכֵלֶת)', greekWord:'hyakinthos (ὑάκινθος)', symbolism:"Blue represents the Law of God and divine authority. The blue thread woven throughout the sanctuary garments was made from a specific dye (likely from the chilazon shellfish), symbolizing heaven and the divine Law written on the two tables of stone.",
   sanctuaryUse:"Blue yarn used in the tabernacle curtains (Exodus 26:1), the veil (Exodus 26:31), the high priest's robe of the ephod (Exodus 28:31), the breastplate, girdle of the ephod, and the ribbons binding the golden plate to the mitre.",
   scriptures:[{ref:'Exodus 26:1', text:'Moreover thou shalt make the tabernacle with ten curtains of fine twined linen, and blue, and purple, and scarlet.'},{ref:'Numbers 15:38', text:'Speak unto the children of Israel, and bid them that they make them fringes in the borders of their garments throughout their generations, and that they put upon the fringe of the borders a ribband of blue:'},{ref:'Numbers 15:39', text:'And it shall be unto you for a fringe, that ye may look upon it, and remember all the commandments of the LORD, and do them.'}]},
  {id:'red', name:'Red/Scarlet', hex:'#b72b2b', hebrewWord:"shani (שָׁנִי) / tola'at shani", greekWord:'kokkinos (κόκκινος)', symbolism:"Scarlet/red represents the blood of Christ, sacrifice, and redemption. The double thread of crimson (tola'at shani — literally 'worm scarlet', from the crimson worm Coccus ilicis) powerfully symbolizes the sacrificial atonement.",
   sanctuaryUse:"Scarlet used in the curtains, veil, gate covering, and high priest's garments. Also used in the cleansing ritual (Leviticus 14) with cedar wood and hyssop — a rich typology of cleansing through blood.",
   scriptures:[{ref:'Isaiah 1:18', text:'Come now, and let us reason together, saith the LORD: though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool.'},{ref:'Hebrews 9:22', text:'And almost all things are by the law purged with blood; and without shedding of blood is no remission.'},{ref:'Revelation 1:5', text:'And from Jesus Christ, who is the faithful witness, and the first begotten of the dead, and the prince of the kings of the earth. Unto him that loved us, and washed us from our sins in his own blood,'}]},
  {id:'white', name:'White/Linen', hex:'#f5f0e8', hebrewWord:'bad (בַּד) / shesh (שֵׁשׁ)', greekWord:'byssinos (βύσσινος)', symbolism:"White represents righteousness, purity, and the imputed righteousness of Christ. Fine white linen (shesh) was the fabric of the priestly garments, signifying the righteousness that must clothe those who serve in God's presence.",
   sanctuaryUse:"Fine twined linen used throughout the tabernacle — the curtains, gate screens, court hangings, and all priestly garments. The high priest wore white linen on the Day of Atonement, laying aside his ornate colored garments.",
   scriptures:[{ref:'Revelation 19:8', text:'And to her was granted that she should be arrayed in fine linen, clean and white: for the fine linen is the righteousness of saints.'},{ref:'Isaiah 61:10', text:'I will greatly rejoice in the LORD, my soul shall be joyful in my God; for he hath clothed me with the garments of salvation, he hath covered me with the robe of righteousness.'},{ref:'Leviticus 16:4', text:'He shall put on the holy linen coat, and he shall have the linen breeches upon his flesh, and shall be girded with a linen girdle, and with the linen mitre shall he be attired: these are holy garments; therefore shall he wash his flesh in water, and so put them on.'}]},
  {id:'gold', name:'Gold', hex:'#c9960c', hebrewWord:'zahav (זָהָב)', greekWord:'chrysos (χρυσός)', symbolism:"Gold represents divinity, the nature of God, and the divine character. The most sacred sanctuary objects — the Ark, mercy seat, lampstand, and altar of incense — were all made of pure gold. Gold cannot be corrupted or tarnished, symbolizing God's incorruptible nature.",
   sanctuaryUse:"The Ark of the Covenant overlaid with pure gold, the mercy seat of solid gold, the golden lampstand beaten from one piece, the altar of incense overlaid with gold, and the crown of gold on the high priest's mitre.",
   scriptures:[{ref:'Exodus 25:11', text:'And thou shalt overlay it with pure gold, within and without shalt thou overlay it, and shalt make upon it a crown of gold round about.'},{ref:'Revelation 21:18', text:'And the building of the wall of it was of jasper: and the city was pure gold, like unto clear glass.'},{ref:'1 Peter 1:7', text:'That the trial of your faith, being much more precious than of gold that perisheth, though it be tried with fire, might be found unto praise and honour and glory at the appearing of Jesus Christ:'}]},
  {id:'purple', name:'Purple', hex:'#6b3fa0', hebrewWord:'argaman (אַרְגָּמָן)', greekWord:'porphyra (πορφύρα)', symbolism:"Purple represents royalty and kingship. Derived from rare mollusks (Murex) along the Phoenician coast, purple dye was extraordinarily expensive and worn only by royalty and the highest nobility. Christ is both Priest and King.",
   sanctuaryUse:"Purple woven throughout the sanctuary curtains and the high priest's garments, signifying that the One served in the sanctuary is not merely a priest but the King of the universe.",
   scriptures:[{ref:'Judges 8:26', text:'And the weight of the golden earrings that he requested was a thousand and seven hundred shekels of gold; beside ornaments, and collars, and purple raiment that was on the kings of Midian.'},{ref:'John 19:2', text:'And the soldiers platted a crown of thorns, and put it on his head, and they put on him a purple robe,'},{ref:'Revelation 17:4', text:'And the woman was arrayed in purple and scarlet colour, and decked with gold and precious stones and pearls.'}]},
  {id:'brass', name:'Brass/Bronze', hex:'#8a6130', hebrewWord:"nechosheth (נְחֹשֶׁת)", greekWord:'chalkos (χαλκός)', symbolism:"Brass (bronze) represents judgment and the endurance of divine justice. The two great bronze objects — the altar of burnt offering and the laver — stand in the outer court as the first objects encountered, representing judgment (for sin) and cleansing (preparation for worship).",
   sanctuaryUse:"The altar of burnt offering was made of shittim wood overlaid with brass. The laver was solid brass, made from the polished mirrors of the women of Israel. The court pillars had brass sockets.",
   scriptures:[{ref:'Exodus 27:1-2', text:'And thou shalt make an altar of shittim wood, five cubits long, and five cubits broad; the altar shall be foursquare: and the height thereof shall be three cubits. And thou shalt make the horns of it upon the four corners thereof: his horns shall be of the same: and thou shalt overlay it with brass.'},{ref:'Numbers 21:9', text:'And Moses made a serpent of brass, and put it upon a pole, and it came to pass, that if a serpent had bitten any man, when he beheld the serpent of brass, he lived.'},{ref:'John 3:14', text:'And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:'}]},
  {id:'silver', name:'Silver', hex:'#9e9e9e', hebrewWord:'keseph (כֶּסֶף)', greekWord:'argyros (ἄργυρος)', symbolism:"Silver represents redemption and the atonement money. Each Israelite paid a 'ransom' or 'atonement money' (the half-shekel tax) in silver — symbolizing that all stand equally in need of redemption. Silver is also connected to the refinement and purification of character.",
   sanctuaryUse:"The 100 silver sockets (adonim) held the tabernacle boards — the foundation rested on redemption. The 20 silver hooks held the court curtains. All came from the census ransom money.",
   scriptures:[{ref:'Exodus 38:27', text:'And of the hundred talents of silver were cast the sockets of the sanctuary, and the sockets of the vail; an hundred sockets of the hundred talents, a talent for a socket.'},{ref:'Psalm 12:6', text:'The words of the LORD are pure words: as silver tried in a furnace of earth, purified seven times.'},{ref:'1 Peter 1:18-19', text:'Forasmuch as ye know that ye were not redeemed with corruptible things, as silver and gold, from your vain conversation received by tradition from your fathers; But with the precious blood of Christ, as of a lamb without blemish and without spot:'}]},
  {id:'dark', name:'Dark/Black', hex:'#2a2a2a', hebrewWord:"techelet shachur (darkness)", greekWord:'skotos (σκότος)', symbolism:"Darkness and the dark (badgers') skin coverings represent sin, separation from God, and the concealment of sacred things from unworthy eyes. The outer covering of the tabernacle (badgers' or seal skins — tachash) was dark, plain, and unadorned — beauty hidden within.",
   sanctuaryUse:"The outermost covering of the tabernacle was made of badgers'/tachash skins — dark and rough, protecting the beautiful inner coverings from weather and concealing the glory within from casual observers.",
   scriptures:[{ref:'Exodus 26:14', text:'And thou shalt make a covering for the tent of rams\' skins dyed red, and a covering above of badgers\' skins.'},{ref:'Isaiah 53:2', text:'For he shall grow up before him as a tender plant, and as a root out of a dry ground: he hath no form nor comeliness; and when we shall see him, there is no beauty that we should desire him.'},{ref:'2 Corinthians 5:21', text:'For he hath made him to be sin for us, who knew no sin; that we might be made the righteousness of God in him.'}]}
];

// ===== SCRIPTURE PASSAGES =====
const SCRIPTURE_PASSAGES = [
  {id:'ark', ref:'Exodus 25:10-22', title:'The Ark of the Covenant', element:'Ark of the Covenant', model:'Tabernacle', zone:'Most Holy Place',
   text:"And they shall make an ark of shittim wood: two cubits and a half shall be the length thereof, and a cubit and a half the breadth thereof, and a cubit and a half the height thereof. And thou shalt overlay it with pure gold, within and without shalt thou overlay it, and shalt make upon it a crown of gold round about... And thou shalt put the mercy seat above upon the ark; and in the ark thou shalt put the testimony that I shall give thee. And there I will meet with thee, and I will commune with thee from above the mercy seat.",
   symbolism:"The Ark represents the throne of God. The mercy seat (kapporeth) is where justice and mercy meet. The two cherubim represent the angelic witnesses to God's justice. The Tables of the Law within represent God's righteous character.",
   type:"The Ark typifies Christ in whom all the fullness of God dwells bodily (Colossians 2:9). The mercy seat typifies the atonement — God's justice satisfied, mercy extended.",
   crossRefs:['Hebrews 9:4','Revelation 11:19','Colossians 1:19-20']},
  {id:'lampstand', ref:'Exodus 25:31-40', title:'Golden Lampstand (Menorah)', element:'Golden Lampstand', model:'Tabernacle', zone:'Holy Place',
   text:"And thou shalt make a candlestick of pure gold: of beaten work shall the candlestick be made: his shaft, and his branches, his bowls, his knops, and his flowers, shall be of the same. And six branches shall come out of the sides of it; three branches of the candlestick out of the one side, and three branches of the candlestick out of the other side... And thou shalt make the seven lamps thereof: and they shall light the lamps thereof, that they may give light over against it.",
   symbolism:"The seven-branched menorah was the only light in the Holy Place. Beaten from one piece of gold, it represents the Holy Spirit's sevenfold gifts and Christ as the light of the world. Oil (olive oil) represents the Holy Spirit.",
   type:"Christ declared, 'I am the light of the world' (John 8:12). The seven churches in Revelation (Rev 1:20) are represented as seven candlesticks, and Christ walks among them.",
   crossRefs:['John 8:12','Revelation 1:20','Zechariah 4:2-6']},
  {id:'showbread', ref:'Exodus 25:23-30', title:'Table of Showbread', element:'Table of Showbread', model:'Tabernacle', zone:'Holy Place',
   text:"Thou shalt also make a table of shittim wood: two cubits shall be the length thereof, and a cubit the breadth thereof, and a cubit and a half the height thereof. And thou shalt overlay it with pure gold, and make thereto a crown of gold round about... And thou shalt set upon the table shewbread before me alway.",
   symbolism:"The 12 loaves (one for each tribe) were replaced every Sabbath by the priests, who ate the old loaves. 'Shewbread' (literally 'bread of the Presence') represents Christ as the Bread of Life, always present before God for His people.",
   type:"'I am the bread of life' (John 6:35). The Sabbath renewal of bread connects Christ's provision with the Sabbath rest. The 12 loaves represent all God's people sustained by the Bread of Life.",
   crossRefs:['John 6:35','Matthew 12:4','Leviticus 24:5-9']},
  {id:'incense', ref:'Exodus 30:1-10', title:'Altar of Incense', element:'Altar of Incense', model:'Tabernacle', zone:'Holy Place',
   text:"And thou shalt make an altar to burn incense upon: of shittim wood shalt thou make it. A cubit shall be the length thereof, and a cubit the breadth thereof; foursquare shall it be: and two cubits shall be the height thereof: the horns thereof shall be of the same... And Aaron shall burn thereon sweet incense every morning: when he dresseth the lamps, he shall burn incense upon it. And when Aaron lighteth the lamps at even, he shall burn incense upon it, a perpetual incense before the LORD throughout your generations.",
   symbolism:"Incense represented prayer and intercession ascending to God. The golden altar stood before the veil between the Holy Place and the Most Holy — close to God's presence. Morning and evening offerings paralleled the daily sacrifices.",
   type:"'Let my prayer be set forth before thee as incense; and the lifting up of my hands as the evening sacrifice' (Psalm 141:2). Christ's intercession is our incense before the Father (Hebrews 7:25; Revelation 8:3-4).",
   crossRefs:['Psalm 141:2','Hebrews 7:25','Revelation 8:3-4']},
  {id:'laver', ref:'Exodus 30:17-21', title:'Bronze Laver', element:'Bronze Laver', model:'Tabernacle', zone:'Outer Court',
   text:"And the LORD spake unto Moses, saying, Thou shalt also make a laver of brass, and his foot also of brass, to wash withal: and thou shalt put it between the tabernacle of the congregation and the altar, and thou shalt put water therein. For Aaron and his sons shall wash their hands and their feet thereat: When they go into the tabernacle of the congregation, they shall wash with water, that they die not; or when they come near to the altar to minister.",
   symbolism:"The laver stood between the altar and the tabernacle, representing the need for cleansing after sacrifice. Made from the bronze mirrors of devout women (Ex 38:8), it reflects: we see ourselves as we are in God's Word, then are cleansed.",
   type:"Baptism typified by the laver — death to sin (the altar) is followed by cleansing and new life (the laver). The Word of God cleanses: 'That he might sanctify and cleanse it with the washing of water by the word' (Ephesians 5:26).",
   crossRefs:['Ephesians 5:26','Titus 3:5','John 13:10']},
  {id:'altar', ref:'Exodus 27:1-8', title:'Bronze Altar (Burnt Offering)', element:'Altar of Burnt Offering', model:'Tabernacle', zone:'Outer Court',
   text:"And thou shalt make an altar of shittim wood, five cubits long, and five cubits broad; the altar shall be foursquare: and the height thereof shall be three cubits. And thou shalt make the horns of it upon the four corners thereof: his horns shall be of the same: and thou shalt overlay it with brass... And thou shalt make his pans to receive his ashes, and his shovels, and his basons, and his fleshhooks, and his firepans: all the vessels thereof thou shalt make of brass.",
   symbolism:"The first object encountered was the bronze altar — judgment and sacrifice. Its five dimensions (5 cubits × 5 cubits × 3 cubits) may symbolize the Pentateuch (five) and the Trinity. The four horns represent complete atonement to all four corners of the earth.",
   type:"The altar typifies Calvary where Christ, 'the Lamb of God which taketh away the sin of the world' (John 1:29), was slain. The fire that never went out (Lev 6:13) speaks of Christ's eternal intercession.",
   crossRefs:['John 1:29','1 Corinthians 5:7','Hebrews 9:14']},
  {id:'solomons', ref:'1 Kings 6:1-38', title:"Solomon's Temple", element:"Solomon's Temple", model:'Solomon', zone:'Jerusalem',
   text:"And it came to pass in the four hundred and eightieth year after the children of Israel were come out of the land of Egypt, in the fourth year of Solomon's reign over Israel, in the month Zif, which is the second month, that he began to build the house of the LORD. And the house which king Solomon built for the LORD, the length thereof was threescore cubits, and the breadth thereof twenty cubits, and the height thereof thirty cubits...",
   symbolism:"Solomon's Temple was twice the size of the Mosaic tabernacle in most dimensions, but maintained the same proportional layout: outer court, Holy Place, and Most Holy Place. Its magnificent construction reflected the glory of God's dwelling place.",
   type:"The greater beauty of Solomon's Temple pointed to the ultimate heavenly sanctuary. The Temple's destruction in 586 BC and 70 AD both pointed to the end of the earthly type as the antitype — Christ's heavenly ministry — was established.",
   crossRefs:['Haggai 2:9','John 2:19-21','Matthew 24:2']},
  {id:'heavenly', ref:'Hebrews 8:1-5', title:'Heavenly Sanctuary', element:'Heavenly Sanctuary', model:'Heavenly', zone:'Heaven',
   text:"Now of the things which we have spoken this is the sum: We have such an high priest, who is set on the right hand of the throne of the Majesty in the heavens; A minister of the sanctuary, and of the true tabernacle, which the Lord pitched, and not man. For every high priest is ordained to offer gifts and sacrifices: wherefore it is of necessity that this man have somewhat also to offer... Who serve unto the example and shadow of heavenly things, as Moses was admonished of God when he was about to make the tabernacle: for, See, saith he, that thou make all things according to the pattern shewed to thee in the mount.",
   symbolism:"The heavenly sanctuary is the original — the earthly was its copy (Heb 8:5). Christ now ministers there as our High Priest, presenting His blood before the Father. It is a real place where real ministry occurs for real people.",
   type:"The heavenly sanctuary is the antitype of the earthly. Just as the earthly had two phases of ministry (daily and annual/Day of Atonement), so Christ's heavenly ministry has two phases: from His ascension to 1844 (the equivalent of the daily), and from 1844 to His Second Advent (the investigative judgment — equivalent to the Day of Atonement).",
   crossRefs:['Hebrews 9:23-24','Revelation 11:19','Daniel 8:14']}
];

// ===== MYTHS & FACTS =====
const MYTHS_DATA = [
  {id:1, cat:'judgment', myth:"The investigative judgment means God doesn't know who is saved", fact:"The investigative judgment demonstrates God's justice to the universe, not His lack of knowledge", explanation:"God is omniscient and knows all things. The investigative judgment is not about God learning who is saved, but about demonstrating to the universe the justice and wisdom of God's decisions. It vindicates God's character before angels and unfallen worlds, showing that His judgments are fair, righteous, and based on genuine repentance and faith.", scripture:"Daniel 7:9-10; Revelation 20:12; Romans 3:4", difficulty:"intermediate"},
  {id:2, cat:'sanctuary', myth:"The sanctuary doctrine is a uniquely Adventist invention", fact:"The sanctuary has been central to biblical theology throughout Christian history", explanation:"While Adventists have developed unique insights about the heavenly sanctuary's two phases, the concept of sanctuary theology appears throughout Scripture and has been recognized by many Christian traditions. The book of Hebrews (written to first-century Jewish Christians) extensively discusses the heavenly sanctuary as the basis for Christian faith.", scripture:"Hebrews 8:1-2; Hebrews 9:11-12; Revelation 11:19", difficulty:"beginner"},
  {id:3, cat:'salvation', myth:"Adventists believe in salvation by works", fact:"Adventists believe in salvation by grace through faith, with works as the fruit of genuine conversion", explanation:"Seventh-day Adventists firmly believe in salvation by grace through faith alone (sola gratia, sola fide). Good works are seen as the natural result of genuine salvation, not the cause of it. This aligns with the full biblical teaching that faith without works is dead — meaning lifeless, not saving. The law is the standard of righteousness, not the means of obtaining it.", scripture:"Ephesians 2:8-9; James 2:17; Titus 2:11-14", difficulty:"beginner"},
  {id:4, cat:'prophecy', myth:"The 2300 days of Daniel 8:14 ended in the Maccabean period (168 BC)", fact:"The 2300 days extend from 457 BC to 1844 AD using the day-year principle", explanation:"While some preterist interpreters see the 2300 days as literal days fulfilled under Antiochus Epiphanes (168-165 BC), several factors make this interpretation untenable: (1) The vision explicitly concerns 'the time of the end' (Dan 8:17); (2) The day-year principle (Num 14:34; Eze 4:6) applies to apocalyptic prophecy; (3) Daniel 9 explicitly links 70 weeks (490 years) to Daniel 8, beginning from 457 BC — making the endpoint 1844.", scripture:"Daniel 8:14; Numbers 14:34; Ezekiel 4:6; Daniel 9:24-25", difficulty:"advanced"},
  {id:5, cat:'denominational', myth:"Adventists worship Ellen White as a prophet equal to Scripture", fact:"Ellen White's writings are considered inspired counsel subordinate to Scripture", explanation:"Adventists view Ellen White as a messenger of the Lord whose writings provide guidance and insight, but Scripture remains the primary, authoritative standard ('the canon'). Her writings consistently point back to the Bible and are to be tested by it. Ellen White herself wrote: 'The Bible is our standard for every doctrine and discipline.' Her writings are never used to establish new doctrines outside of Scripture.", scripture:"Isaiah 8:20; 1 Thessalonians 5:20-21; Acts 17:11", difficulty:"intermediate"},
  {id:6, cat:'sanctuary', myth:"The heavenly sanctuary is purely symbolic, not a literal place", fact:"Scripture presents the heavenly sanctuary as a real location where Christ literally ministers", explanation:"While the earthly sanctuary was symbolic of heavenly realities, the heavenly sanctuary is the original and genuine. Hebrews presents the heavenly sanctuary as 'the true tabernacle, which the Lord pitched, and not man' (Heb 8:2). It is the place where Christ, as our High Priest, literally presents His blood and intercedes for believers (Heb 9:24). Revelation's vision of God's temple in heaven (Rev 11:19) shows the ark of the testament there.", scripture:"Hebrews 8:2; Hebrews 9:24; Revelation 11:19", difficulty:"intermediate"},
  {id:7, cat:'judgment', myth:"The investigative judgment contradicts 'no condemnation in Christ' (Romans 8:1)", fact:"The investigative judgment is entirely consistent with justification by faith", explanation:"Romans 8:1 assures believers of no condemnation. The investigative judgment does not undermine this — it demonstrates it publicly. In the judgment, the records show genuine repentance and acceptance of Christ's righteousness. The judgment vindicates the saved, not condemns them. It is God's way of opening the 'books' (Rev 20:12) before the universe, showing the basis on which He forgives sin.", scripture:"Romans 8:1; Daniel 7:22; Matthew 25:31-46", difficulty:"advanced"},
  {id:8, cat:'prophecy', myth:"Antiochus Epiphanes fully fulfills the 'little horn' of Daniel 7 and 8", fact:"The little horn prophecies primarily describe the papal power of Medieval Rome", explanation:"Antiochus Epiphanes (175-163 BC) is a partial type, but cannot fulfill the complete prophecy: (1) Daniel 7's little horn comes from the fourth beast (Rome), not the third (Greece); (2) The little horn of Daniel 7 persecutes for 'a time, times, and dividing of time' — 1,260 years (538-1798 AD), not 3.5 literal years; (3) The little horn 'thinks to change times and laws' — referring to the alteration of God's law.", scripture:"Daniel 7:8,25; Daniel 8:9-14; 2 Thessalonians 2:3-4", difficulty:"advanced"},
  {id:9, cat:'sanctuary', myth:"Christ went directly to the Most Holy Place at His ascension in 31 AD", fact:"Scripture and typology indicate Christ began His ministry in the Holy Place and entered the Most Holy in 1844", explanation:"The Day of Atonement (Most Holy Place ministry) was an annual event — not the daily service. The parallel is: (1) Daily ministry = Holy Place = from ascension 31 AD to 1844; (2) Day of Atonement = Most Holy Place = from 1844 to Second Coming. Hebrews 9:6-8 distinguishes these two phases. Daniel 8:14's 'cleansing of the sanctuary' marks the transition to the Most Holy Place ministry.", scripture:"Leviticus 16; Hebrews 9:6-8; Daniel 8:14", difficulty:"advanced"},
  {id:10, cat:'salvation', myth:"The Seventh-day Sabbath is merely a Jewish institution, abolished at the cross", fact:"The Sabbath was established at creation for all humanity, and reaffirmed in the New Testament", explanation:"The Sabbath was instituted at creation (Gen 2:2-3) before there was a Jewish people — it is humanity's institution. Jesus observed the Sabbath (Luke 4:16) and said He is 'Lord also of the sabbath' (Mark 2:28). The Sabbath commandment is the only one beginning with 'Remember' — indicating forgetfulness was anticipated. There is no New Testament text changing the Sabbath to Sunday.", scripture:"Genesis 2:2-3; Exodus 20:8-11; Luke 4:16; Mark 2:28", difficulty:"beginner"}
];

// ===== EDUCATOR RESOURCES =====
const EDUCATOR_RESOURCES = [
  {id:1, title:"Sanctuary Colors Interactive Lesson", cat:"lesson-plans", age:"children", duration:"45 minutes", desc:"Hands-on lesson exploring the eight sacred colors and their biblical meanings. Students create color cards and match each color to its scriptural significance.", objectives:["Identify the 8 sanctuary colors","Understand their symbolic meanings","Connect colors to Bible stories and Christ's ministry"], materials:["Colored paper","Markers","KJV Bible","Activity worksheets"], downloads:["Lesson Plan PDF","Activity Sheets","Color Cards Template","Teacher's Guide"], quarter:"Q2 2026 — Sanctuary Studies"},
  {id:2, title:"Build a Tabernacle Model", cat:"activities", age:"youth", duration:"90 minutes", desc:"Group activity to construct a proportional scale model of the wilderness tabernacle using simple materials. Emphasizes exact biblical dimensions and arrangement.", objectives:["Learn tabernacle proportions and dimensions","Understand the spatial relationship of components","Practice collaborative learning"], materials:["Foam board","Gold/silver paint","Fabric scraps","Measuring tools","Popsicle sticks"], downloads:["Construction Instructions","Dimension Templates","Materials List","Presentation Notes"], quarter:"Q1 2026 — Old Testament Sanctuaries"},
  {id:3, title:"Investigative Judgment Presentation", cat:"presentations", age:"adult", duration:"60 minutes", desc:"Comprehensive presentation on the doctrine of the investigative judgment, covering Daniel 7 and 8, the 2300-day prophecy, and the 1844 development. Includes Q&A guide.", objectives:["Explain the biblical basis in Daniel 7-9","Clarify common misconceptions","Show the Day of Atonement typology","Present the 1844 historical context"], materials:["Projector","Computer","Printed handouts"], downloads:["PowerPoint File (.pptx)","Speaker Notes PDF","Audience Handout","Timeline Chart"], quarter:"Q3 2026 — Prophetic Studies"},
  {id:4, title:"Aaron's Ministry Role Play", cat:"activities", age:"mixed", duration:"30 minutes", desc:"Interactive dramatic presentation of the Day of Atonement service (Leviticus 16), connecting each step to Christ's heavenly ministry. Memorable and engaging for all ages.", objectives:["Visualize the Day of Atonement service","Understand each step's symbolic meaning","Connect the earthly type to Christ's heavenly antitype"], materials:["Simple costumes","Props (censer, bread, etc.)","Script cards","Background music"], downloads:["Full Script PDF","Costume Guide","Props Checklist","Director's Notes"], quarter:"Q4 2026 — Types and Antitypes"},
  {id:5, title:"Sanctuary Furnishings Worksheet Set", cat:"printables", age:"children", duration:"20–30 minutes", desc:"A complete set of fill-in-the-blank worksheets covering all seven sanctuary furnishings, their materials, location, and symbolic meaning. KJV scripture references included.", objectives:["Name all sanctuary furnishings","Identify their location (court, holy, most holy)","State the primary symbolic meaning of each"], materials:["Printed worksheets","Pencils","KJV Bible for reference"], downloads:["Worksheet Set PDF (7 sheets)","Answer Key","Illustrated Diagram"], quarter:"All Quarters"},
  {id:6, title:"Daniel 8:14 Timeline Study", cat:"lesson-plans", age:"adult", duration:"60 minutes", desc:"Step-by-step study of Daniel 8 and 9, walking through the 2300-day prophecy, the 70-week cut-off, the 457 BC starting point, and the 1844 terminus. Includes Greek and Hebrew word studies.", objectives:["Understand the year-day principle","Calculate the 70-week and 2300-day prophecies","Explain the 1844 significance","Respond to common objections"], materials:["Study guide printout","Calculator","Bible dictionary","Timeline chart"], downloads:["Study Guide PDF","Timeline Wall Chart","Answer Key","Bibliography"], quarter:"Q3 2026 — Daniel and Revelation"},
  {id:7, title:"Sacred Colors Scripture Matching Game", cat:"activities", age:"children", duration:"25 minutes", desc:"Card-matching game where students match each sanctuary color to its biblical meaning, Hebrew name, and key scripture verse. Can be played individually or in teams.", objectives:["Memorize the 8 sacred colors and meanings","Associate colors with Hebrew terminology","Reinforce scripture memorization"], materials:["Printed card sets","Scissors","Optional: laminator"], downloads:["Game Cards PDF (printable)","Game Rules","Teacher Instructions"], quarter:"Q2 2026 — Sanctuary Studies"},
  {id:8, title:"Heavenly Sanctuary Discussion Guide", cat:"printables", age:"mixed", duration:"45 minutes", desc:"Structured discussion guide for small groups exploring the reality of the heavenly sanctuary in Hebrews, the nature of Christ's high priestly ministry, and its practical implications for Christian living.", objectives:["Establish the biblical reality of the heavenly sanctuary","Understand Christ's ongoing high priestly work","Apply sanctuary truth to daily Christian experience"], materials:["Discussion guide (one per person)","KJV Bible"], downloads:["Discussion Guide PDF","Leader's Notes","Follow-up Questions"], quarter:"All Quarters"},
  {id:9, title:"Comparison Chart: Earthly vs Heavenly Sanctuary", cat:"printables", age:"youth", duration:"30 minutes", desc:"Detailed comparison chart contrasting the earthly sanctuary with the heavenly, the Levitical priesthood with Christ's Melchizedek priesthood, and the old covenant with the new. Based on the book of Hebrews.", objectives:["Compare type and antitype systematically","Understand Christ's superior priesthood","See the inadequacy of the earthly system and its fulfillment in Christ"], materials:["Printed comparison chart","KJV Bible","Colored highlighters"], downloads:["Comparison Chart PDF","Study Notes","Scripture List"], quarter:"Q4 2026 — Types and Antitypes"},
];

// ===== FORUM DATA =====
const FORUM_CATEGORIES = [
  {id:'all', name:'All Discussions', count:156},
  {id:'sanctuary', name:'Sanctuary Doctrine', count:45},
  {id:'hebrews', name:'Hebrews & Sanctuary', count:28},
  {id:'daniel', name:'Daniel 8:14 Explained', count:32},
  {id:'judgment', name:'Investigative Judgment', count:23},
  {id:'prophecy', name:'Prophetic Studies', count:18},
  {id:'general', name:'General Discussion', count:10}
];
const FORUM_THREADS = [
  {id:1, title:'Understanding the Daily (Tamid) in Daniel 8:11-13', cat:'daniel', author:'BiblicalScholar', role:'Moderator', replies:24, views:342, time:'2 hours ago', pinned:true, tags:['Daniel','Daily','Tamid','Prophecy']},
  {id:2, title:"Hebrews 9:23 — Why must 'heavenly things' be purified?", cat:'hebrews', author:'SanctuaryStudent', role:'Member', replies:18, views:256, time:'4 hours ago', pinned:false, tags:['Hebrews','Cleansing','Heavenly']},
  {id:3, title:'The Role of the Scapegoat in Leviticus 16: Azazel explained', cat:'sanctuary', author:'TheologyProf', role:'Expert', replies:31, views:489, time:'6 hours ago', pinned:true, tags:['Leviticus 16','Scapegoat','Atonement']},
  {id:4, title:'Questions about the 1844 Investigative Judgment: Biblical support?', cat:'judgment', author:'NewSeeker', role:'Member', replies:12, views:178, time:'1 day ago', pinned:false, tags:['1844','Judgment','Questions']},
  {id:5, title:'Comparing sanctuary views across Protestant denominations', cat:'general', author:'ComparativeStudy', role:'Member', replies:45, views:623, time:'2 days ago', pinned:false, tags:['Comparative','Denominations']},
  {id:6, title:"The 70 Weeks of Daniel 9: Connection to Daniel 8:14", cat:'daniel', author:'ProphecyResearcher', role:'Expert', replies:37, views:541, time:'3 days ago', pinned:true, tags:['70 Weeks','Daniel 9','457 BC']},
  {id:7, title:'Christ as High Priest — Hebrews 4:14-16 in depth', cat:'hebrews', author:'PriestlyMinistry', role:'Moderator', replies:22, views:298, time:'3 days ago', pinned:false, tags:['High Priest','Hebrews 4','Intercession']},
  {id:8, title:"Was the 'sanctuary' in Daniel 8:14 the earthly or heavenly?", cat:'sanctuary', author:'HeavenlyThings', role:'Member', replies:29, views:415, time:'4 days ago', pinned:false, tags:['Daniel 8:14','Sanctuary','Cleansing']},
  {id:9, title:'Sacred Colors of the Sanctuary: deeper study resources?', cat:'sanctuary', author:'ColorScholar', role:'Member', replies:8, views:124, time:'5 days ago', pinned:false, tags:['Colors','Symbolism','Resources']},
  {id:10, title:"Crosier's 1846 article: How it shaped Adventist sanctuary theology", cat:'general', author:'HistoricalResearcher', role:'Expert', replies:19, views:267, time:'1 week ago', pinned:false, tags:['Crosier','History','1844 Movement']}
];

// ===== MEDIA DATA =====
const PODCAST_EPISODES = [
  {id:1, title:'Understanding the Investigative Judgment', desc:"Dr. Frank Holbrook discusses the biblical foundation of the investigative judgment doctrine, examining Daniel 7 and 8 in depth with scholarly precision.", duration:'45:32', date:'January 15, 2026', guest:'Dr. Frank Holbrook', guestTitle:'Biblical Research Institute', topics:['Daniel 8:14','Investigative Judgment','Sanctuary Doctrine'], downloads:1250, rating:4.8},
  {id:2, title:'The Eight Sacred Colors of the Sanctuary', desc:"An in-depth exploration of the eight sacred colors woven into the tabernacle and their deep spiritual significance for Christian life and theology.", duration:'38:15', date:'January 8, 2026', guest:'Dr. Leslie Hardinge', guestTitle:'Andrews University', topics:['Sanctuary Colors','Symbolism','Biblical Typology'], downloads:980, rating:4.9},
  {id:3, title:'From Tabernacle to Temple: Architectural Evolution', desc:"Tracing the development of sacred spaces from the wilderness tabernacle through Solomon's Temple to the heavenly sanctuary envisioned in Revelation.", duration:'52:18', date:'January 1, 2026', guest:'Dr. William Shea', guestTitle:'Biblical Archaeology, Andrews University', topics:['Architecture','Historical Development','Solomon\'s Temple'], downloads:1100, rating:4.7},
  {id:4, title:'Hebrews and the Heavenly Sanctuary', desc:"Unpacking the theology of the book of Hebrews and its comprehensive argument for Christ's superior high priestly ministry in the heavenly sanctuary.", duration:'41:27', date:'December 25, 2025', guest:'Dr. Jiří Moskala', guestTitle:'Andrews University Theological Seminary', topics:['Book of Hebrews','Heavenly Sanctuary','New Testament'], downloads:1350, rating:4.9},
  {id:5, title:'The Day of Atonement: Type and Antitype', desc:"Examining Leviticus 16 and its profound fulfillment in Christ's ministry, exploring the scapegoat, the blood, and the cosmic significance of Yom Kippur.", duration:'47:03', date:'December 18, 2025', guest:'Dr. Ángel Manuel Rodríguez', guestTitle:'Former Director, Biblical Research Institute', topics:['Day of Atonement','Leviticus 16','Scapegoat Theology'], downloads:1180, rating:4.8},
  {id:6, title:"Vance Ferrell's Biblical Defense: A Scholar Reviews", desc:"A scholarly discussion of the key arguments in 'A Biblical Defense' defending Adventist sanctuary beliefs in Daniel and Hebrews against modern critiques.", duration:'55:40', date:'December 10, 2025', guest:'Dr. Richard Davidson', guestTitle:'Andrews University Theological Seminary', topics:['Daniel','Hebrews','Biblical Defense','2300 Days'], downloads:890, rating:4.7}
];
const VIDEO_SERIES = [
  {id:1, title:'Sanctuary Foundations', desc:'A comprehensive 10-part series covering sanctuary basics for new students and review for experienced students.', episodes:10, duration:'8 hours 32 minutes', topics:['Overview','History','Typology','Prophecy']},
  {id:2, title:'Hebrews Verse by Verse', desc:"A detailed chapter-by-chapter study of the book of Hebrews, emphasizing the sanctuary themes woven throughout Paul's masterwork.", episodes:13, duration:'11 hours 15 minutes', topics:['New Covenant','High Priesthood','Faith','Warnings']},
  {id:3, title:'Daniel and Revelation Symposium', desc:"Expert panels discussing the prophetic books of Daniel and Revelation, with special attention to sanctuary and judgment themes.", episodes:8, duration:'6 hours 48 minutes', topics:['Daniel 7-9','Revelation 4-5','Prophetic Timeline','2300 Days']},
  {id:4, title:'The Investigative Judgment Documentary', desc:"A four-part documentary series exploring the historical, biblical, and theological aspects of the investigative judgment doctrine.", episodes:4, duration:'3 hours 22 minutes', topics:['1844 History','Biblical Basis','Theological Implications','Common Questions']}
];

// ===== FEATURES (Home Page) =====
const HOME_FEATURES = [
  {id:'explorer', title:'3D Sanctuary Explorer', desc:'Historically accurate models of biblical sanctuaries with interactive exploration.', features:['Wilderness Tabernacle','Solomon\'s Temple','Herod\'s Temple','Heavenly Sanctuary'], icon:'🏛', page:'explorer'},
  {id:'compare', title:'Compare Sanctuaries', desc:'Side-by-side analysis with structural, material, and dimensional comparisons.', features:['Historical Timeline','Structural Analysis','Material Comparisons','Dimension Charts'], icon:'⚖', page:'compare'},
  {id:'scripture', title:'Scripture Navigator', desc:'Link biblical texts directly to sanctuary elements and explore their meaning.', features:['KJV Text','Passage-to-Element Linking','Word Studies','Cross-References'], icon:'🔍', page:'scripture'},
  {id:'symbolism', title:'Symbolism Explorer', desc:'Discover the theological meaning behind every furnishing and element.', features:['Type & Antitype','Hebrew Word Studies','Scholar Analysis','Comparative Views'], icon:'✨', page:'symbolism'},
  {id:'timeline', title:'Ministry Timeline', desc:'14-step parallel comparison of Aaron\'s earthly and Jesus\' heavenly ministry.', features:['14 Parallel Steps','Full KJV References','Interactive Navigation','Study Mode'], icon:'⏱', page:'timeline'},
  {id:'heavenly', title:'Heavenly Portal', desc:'Progressive journey from outer court to the throne room of God.', features:['4-Stage Journey','Scripture Overlays','Theological Context','Ambient Experience'], icon:'⭐', page:'heavenly'},
  {id:'judgment', title:'Investigative Judgment', desc:'Interactive learning about this cornerstone of Adventist doctrine.', features:['Daniel 8:14 Timeline','1844 Historical Context','Biblical Foundation','Knowledge Checks'], icon:'🛡', page:'judgment'},
  {id:'library', title:'Digital Library', desc:'Classic Adventist texts and scholarly resources with citation tools.', features:['5 Classic Books','Biblical Defense (2003)','Citation Tools','Advanced Search'], icon:'📚', page:'library'},
  {id:'bible', title:'KJV Bible Study', desc:'King James Version with key sanctuary passages and study tools.', features:['Complete KJV','Sanctuary Passages','Memorization Tools','Cross-References'], icon:'📖', page:'bible'},
  {id:'colors', title:'Sacred Colors', desc:'Eight divine colors and their profound spiritual significance.', features:['Blue — God\'s Law','Red — Christ\'s Blood','White — Righteousness','Gold — Divinity'], icon:'🎨', page:'colors'},
  {id:'myths', title:'Myth vs. Fact', desc:'Clarify common doctrinal misconceptions with biblical evidence.', features:['10 Common Myths','Scripture Defense','Multiple Categories','Biblical Evidence'], icon:'❓', page:'myths'},
  {id:'educators', title:'Educator Resources', desc:'Teaching tools and lesson plans for pastors and teachers.', features:['9 Lesson Plans','Activities & Printables','Age-Group Filtering','Downloadable Materials'], icon:'🎓', page:'educators'},
  {id:'media', title:'Companion Media', desc:'Podcasts and video series with expert scholars.', features:['6 Podcast Episodes','4 Video Series','Discussion Guides','Expert Scholars'], icon:'🎧', page:'media'},
  {id:'forums', title:'Discussion Forums', desc:'Moderated community dialogue and study groups.', features:['7 Topic Categories','Moderated Threads','Scholar Participation','Community Guidelines'], icon:'💬', page:'forums'},
  {id:'profiles', title:'Learning Profile', desc:'Track your progress and achievements across all modules.', features:['Progress Tracking','12 Achievements','Bookmarks','Activity History'], icon:'👤', page:'profiles'}
];

// ===== LIBRARY BOOKS =====
const LIBRARY_BOOKS = [
  {id:'crosier', title:"The Sanctuary: Center of Christ's Work", author:"O.R.L. Crosier", year:"1846", color:"#b45309", colorLight:"#fef3c7", chapters:8, scriptures:"100+", desc:"The foundational 1846 exposition of heavenly sanctuary doctrine that emerged from the 1844 Great Disappointment. Endorsed by Ellen G. White. Established the biblical basis for Christ's two-phase ministry in the heavenly sanctuary.", tags:["Heavenly Sanctuary","1844 Movement","Investigative Judgment","Type & Antitype","Day of Atonement"], special:"EGW Endorsed", page:'book-crosier'},
  {id:'haskell', title:"The Cross and Its Shadow", author:"Stephen N. Haskell", year:"1896–1914", color:"#1d4e89", colorLight:"#dbeafe", chapters:28, scriptures:"200+", desc:"The most comprehensive study of the Old Testament sanctuary and its services, demonstrating how every element prefigured Christ's ministry. Systematic exploration of each offering, feast, and furnishing.", tags:["Levitical Services","Type & Antitype","Sanctuary Furniture","The Offerings","The Feasts"], special:"Pioneer Classic", page:'book-haskell'},
  {id:'andreasen', title:"The Sanctuary Service", author:"M.L. Andreasen", year:"1947", color:"#5b21b6", colorLight:"#ede9fe", chapters:22, scriptures:"150+", desc:"A comprehensive mid-20th century exposition of sanctuary theology. Explores the sacrificial system, Day of Atonement, investigative judgment, and last generation theology. Presents the sanctuary as the central organizing principle of biblical theology.", tags:["Investigative Judgment","Last Generation","Scapegoat Theology","Five Offerings","Prophetic Timeline"], special:"Systematic Study", page:'book-andreasen'},
  {id:'gilbert', title:"Messiah in His Sanctuary", author:"F.C. Gilbert", year:"Early 1900s", color:"#0f766e", colorLight:"#ccfbf1", chapters:40, scriptures:"250+", desc:"A comprehensive exploration of sanctuary theology by former rabbi F.C. Gilbert, who converted to Christianity after discovering Jesus as the Messiah through Old Testament prophecy. Written from a unique Jewish-Christian perspective.", tags:["Jewish Background","Advent Movement","Prophetic Timeline","Remnant Church","Last Days Events"], special:"Jewish-Christian Perspective", page:'book-gilbert'},
  {id:'defense', title:"A Biblical Defense of the Sanctuary", author:"Vance Ferrell", year:"2003", color:"#1e3a5f", colorLight:"#e0eeff", chapters:12, scriptures:"300+", desc:"A solid biblical reply to each objection to Adventist beliefs about the Sanctuary in the books of Daniel and Hebrews. Contains 40 studies in Daniel and 70 studies in Hebrews. Reviewed and endorsed by Dr. William H. Shea, Associate Director of the GC Biblical Research Institute.", tags:["Book of Daniel","Book of Hebrews","2300 Days","Investigative Judgment","Prophetic Defense"], special:"Dr. Shea Endorsed", page:'book-defense'}
];