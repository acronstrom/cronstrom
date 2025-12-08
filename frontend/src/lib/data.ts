import type { Artwork, ArtistBio, EducationItem, Exhibition } from './types';

// Real artwork data from cronstrom.net/galleri
export const defaultArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Vita gäss',
    medium: 'Akvarell',
    dimensions: '40 x 50 cm',
    year: '2022',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2022/04/IMG_0252-768x711.jpg',
    category: 'Galleri',
    description: 'Vita gäss i rörelse mot en öppen himmel.',
    status: 'available',
    price: '8 000 kr'
  },
  {
    id: '2',
    title: 'Berget',
    medium: 'Akvarell',
    dimensions: '50 x 35 cm',
    year: '2023',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2023/03/Bergetl-768x507.jpg',
    category: 'Galleri',
    description: 'Ett dramatiskt bergslandskap i nordisk anda.',
    status: 'available',
    price: '10 000 kr'
  },
  {
    id: '3',
    title: 'Vita gäss III',
    medium: 'Akvarell',
    dimensions: '60 x 80 cm',
    year: '2023',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2023/03/Vita-gass-lll-720x1024.jpg',
    category: 'Galleri',
    description: 'Den tredje i serien av vita gäss, en studie i rörelse och ljus.',
    status: 'sold'
  },
  {
    id: '4',
    title: 'Samtal pågår',
    medium: 'Akvarell',
    dimensions: '45 x 60 cm',
    year: '2023',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2023/03/samtal-pagar-768x996.jpg',
    category: 'Galleri',
    description: 'Ett ögonblick av kommunikation fångat i färg.',
    status: 'available',
    price: '12 000 kr'
  },
  {
    id: '5',
    title: 'Tar sjövägen',
    medium: 'Akvarell',
    dimensions: '50 x 50 cm',
    year: '2024',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/Tar-sjovagen-kopia-768x776.jpg',
    category: 'Galleri',
    description: 'En resa över vatten, inspirerad av skärgårdens rytm.',
    status: 'available',
    price: '9 500 kr'
  },
  {
    id: '6',
    title: 'Vem där?',
    medium: 'Akvarell',
    dimensions: '40 x 40 cm',
    year: '2024',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/Vem-dar_-768x732.png',
    category: 'Galleri',
    description: 'En fråga ställd genom penseldraget.',
    status: 'available',
    price: '7 500 kr'
  },
  {
    id: '7',
    title: 'Väntan',
    medium: 'Akvarell',
    dimensions: '55 x 70 cm',
    year: '2024',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/Vantan-768x1023.png',
    category: 'Galleri',
    description: 'Tålamod och stillhet fångat i ett ögonblick.',
    status: 'sold'
  },
  {
    id: '8',
    title: 'Kappsegling',
    medium: 'Akvarell',
    dimensions: '45 x 65 cm',
    year: '2024',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/kappsegling-659x1024.png',
    category: 'Galleri',
    description: 'Seglingens spänning och vindens kraft.',
    status: 'available',
    price: '11 000 kr'
  },
  {
    id: '9',
    title: 'Tätatät',
    medium: 'Akvarell',
    dimensions: '50 x 70 cm',
    year: '2024',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/Tatatat-ll-1-712x1024.png',
    category: 'Galleri',
    description: 'Närhet och samhörighet uttryckt i form och färg.',
    status: 'available',
    price: '13 000 kr'
  },
  {
    id: '10',
    title: 'Vattenfall',
    medium: 'Akvarell',
    dimensions: '50 x 50 cm',
    year: '2024',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/03/Vattenfall-768x747.png',
    category: 'Galleri',
    description: 'Vattnets kraft och rörelse i naturens magi.',
    status: 'available',
    price: '9 000 kr'
  },
  {
    id: '11',
    title: 'Dit näbben pekar',
    medium: 'Akvarell',
    dimensions: '45 x 35 cm',
    year: '2025',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2025/03/Dit-nabben-pekar--768x588.jpg',
    category: 'Galleri',
    description: 'Fåglarnas riktning och instinkt.',
    status: 'available',
    price: '8 500 kr'
  },
  {
    id: '12',
    title: 'Fågelskådare',
    medium: 'Akvarell',
    dimensions: '50 x 50 cm',
    year: '2025',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2025/03/Fagelskadare--768x773.jpg',
    category: 'Galleri',
    description: 'En hyllning till naturens observatörer.',
    status: 'available',
    price: '10 500 kr'
  },
  {
    id: '13',
    title: 'Hänger ihop',
    medium: 'Akvarell',
    dimensions: '55 x 70 cm',
    year: '2025',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2025/03/Hanger-ihop-768x984.jpg',
    category: 'Galleri',
    description: 'Samband och samhörighet i naturens värld.',
    status: 'available',
    price: '12 500 kr'
  },
  {
    id: '14',
    title: 'Skogsglänta',
    medium: 'Akvarell',
    dimensions: '50 x 50 cm',
    year: '2025',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2025/03/skogsglanta-768x779.jpg',
    category: 'Galleri',
    description: 'Ljuset som bryter igenom skogens tak.',
    status: 'available',
    price: '9 500 kr'
  },
  {
    id: '15',
    title: 'Soligt',
    medium: 'Akvarell',
    dimensions: '45 x 45 cm',
    year: '2025',
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2025/03/Soligt-768x741.jpg',
    category: 'Galleri',
    description: 'Solens värme och ljus i akvarellens transparens.',
    status: 'available',
    price: '8 000 kr'
  }
];

export const defaultArtistBio: ArtistBio = {
  name: 'Lena Cronström',
  tagline: 'En målning är en hemlighet om en hemlighet, ju mer du ser – desto mindre får du veta...',
  shortBio: 'I en värld fylld av bilder, ljud och rörelse vill jag bjuda in och uppmana åskådaren: Stanna upp, betrakta och reflektera. Mina målningar i akvarell, akryl och olja är ofta halvabstrakta med färg som går före form. De flesta kan ses som "inre bilder", gestaltning av känslor, minnen, drömmar och fragment av min vardag.',
  fullBio: `Lena Cronströms konstnärliga resa började med en fascination för naturens texturer och fåglarnas graciösa rörelser. Född i Stockholm och verksam från sin ateljé i skärgården, hämtar hon inspiration från den skarpa kontrasten mellan det karga landskapet och Nordens stilla ljus.
  
  Hennes process är intuitiv, börjar ofta med en enda färg eller gest och bygger lager för att skapa djup och historia på papperet. Akvarellens transparens och oförutsägbarhet är centrala element i hennes konstnärskap.
  
  Hennes verk har ställts ut på gallerier runt om i Sverige och finns representerade i privata samlingar världen över.`,
  exhibitions: [
    { year: '2024', title: 'Fåglar i rörelse', location: 'Galleri Blå, Stockholm', category: 'kommande' },
    { year: '2023', title: 'Nordiska landskap', location: 'Konsthallen, Göteborg', category: 'separat' },
    { year: '2022', title: 'Akvarellens magi', location: 'Kulturhuset, Malmö', category: 'separat' },
    { year: '2023', title: 'Svenska akvarellister', location: 'Nationalmuseum, Stockholm', category: 'samling' },
    { year: '2021', title: 'Naturmotiv', location: 'Konstföreningen, Uppsala', category: 'samling' },
    { year: '2020', title: 'Vårsalongen', location: 'Liljevalchs, Stockholm', category: 'jury' }
  ]
};

export const defaultEducationData: EducationItem[] = [
  { year: '2015-2018', school: 'Konstfack', program: 'Kandidatprogram i Fri Konst' },
  { year: '2013-2015', school: 'Gerlesborgsskolan', program: 'Förberedande Konstnärlig Utbildning' }
];

// Exhibition data from cronstrom.net/utstallningar/
export const exhibitions: Exhibition[] = [
  // Uppdrag / Representerad
  {
    id: 'rep-1',
    title: 'Nobeldiplom',
    venue: 'Kungliga Vetenskapsakademien, Stockholm & Nobelmuseet',
    date: '2011, 2012, 2013',
    type: 'Solo',
    category: 'kommande',
    description: 'Nobeldiplom för Kungliga Vetenskapsakademien.'
  },
  {
    id: 'rep-2',
    title: 'Representerad',
    venue: 'Höganäs kommun',
    date: '',
    type: 'Solo',
    category: 'kommande',
    description: 'Konstverk i Höganäs kommuns samling.'
  },
  
  // Jurybedömda utställningar
  {
    id: 'jury-1',
    title: 'Ansikten',
    venue: 'Karantänen',
    date: '2024',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd utställning på temat Ansikten.'
  },
  {
    id: 'jury-2',
    title: 'Gerlesborgssalongen',
    venue: 'Gerlesborgsskolan',
    date: '2017',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd salong på Gerlesborgsskolan.'
  },
  {
    id: 'jury-3',
    title: 'Höstsalong',
    venue: 'Skånes Konstförening, Malmö',
    date: '2011',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd höstsalong.'
  },
  {
    id: 'jury-4',
    title: 'Kullasalongen',
    venue: 'Krapperups konsthall',
    date: '2011',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd utställning på Krapperups konsthall.'
  },
  {
    id: 'jury-5',
    title: 'Akvarellsalong',
    venue: 'Ulricehamns konsthall',
    date: '2010',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd akvarellsalong.'
  },
  {
    id: 'jury-6',
    title: 'Akvarellsalong',
    venue: 'Väsby konsthall',
    date: '2008, 2010, 2011',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd akvarellsalong på Väsby konsthall.'
  },
  {
    id: 'jury-7',
    title: 'Utställning',
    venue: 'Gerlesborgsskolans Galleri',
    date: '2008',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd utställning.'
  },
  {
    id: 'jury-8',
    title: 'Utställning',
    venue: 'Yllan, Kristianstad',
    date: '2007',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd utställning.'
  },
  {
    id: 'jury-9',
    title: 'Vårutställning',
    venue: 'Landskrona konsthall',
    date: '2004',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd vårutställning.'
  },
  {
    id: 'jury-10',
    title: '30 x 30',
    venue: 'Väsby konsthall',
    date: '2004',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd utställning med formatet 30x30.'
  },
  {
    id: 'jury-11',
    title: 'Utställning',
    venue: 'Vadstena Slott',
    date: '2005, 2006',
    type: 'Group',
    category: 'jury',
    description: 'Jurybedömd utställning på Vadstena Slott.'
  },
  
  // Separatutställningar
  {
    id: 'sep-1',
    title: 'Konstrundan NVSK',
    venue: 'Nordvästra Skånes Konstförening',
    date: '2013-2025',
    type: 'Solo',
    category: 'separat',
    description: 'Årlig konstrunda med NVSK sedan 2013.'
  },
  {
    id: 'sep-2',
    title: 'Separatutställning',
    venue: 'Galleri Fågel, Beddingestrand',
    date: '2017',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning på Galleri Fågel.'
  },
  {
    id: 'sep-3',
    title: 'Separatutställning',
    venue: 'Mor Oliviagården, Ronneby',
    date: '2016',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Ronneby.'
  },
  {
    id: 'sep-4',
    title: 'Separatutställning',
    venue: 'Konsthallen Höör, Kulturhuset Anders',
    date: '2015',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Höör.'
  },
  {
    id: 'sep-5',
    title: 'Separatutställning',
    venue: 'Galleri Småland',
    date: '2015',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning på Galleri Småland.'
  },
  {
    id: 'sep-6',
    title: 'Separatutställning',
    venue: 'Annexet Mölle',
    date: '2012',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Mölle.'
  },
  {
    id: 'sep-7',
    title: 'Separatutställning',
    venue: 'Galleri SolLång',
    date: '2012',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning på Galleri SolLång.'
  },
  {
    id: 'sep-8',
    title: 'Separatutställning',
    venue: 'Galleri Babord, Höganäs',
    date: '2010, 2011',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning på Galleri Babord.'
  },
  {
    id: 'sep-9',
    title: 'Separatutställning',
    venue: 'Örkelljunga konsthall',
    date: '2010',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Örkelljunga.'
  },
  {
    id: 'sep-10',
    title: 'Separatutställning',
    venue: 'Galleri Ztrand, Halmstad',
    date: '2009',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Halmstad.'
  },
  {
    id: 'sep-11',
    title: 'Separatutställning',
    venue: 'Frennegalleriet, Torekov',
    date: '2008',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Torekov.'
  },
  {
    id: 'sep-12',
    title: 'Separatutställning',
    venue: 'Svalövs kommun',
    date: '2007',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Svalöv.'
  },
  {
    id: 'sep-13',
    title: 'Separatutställning',
    venue: 'Åstorps kommun',
    date: '2007',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Åstorp.'
  },
  {
    id: 'sep-14',
    title: 'Separatutställning',
    venue: 'Höörs kommun',
    date: '2006',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Höör.'
  },
  {
    id: 'sep-15',
    title: 'Separatutställning',
    venue: 'Galleri Bruket, Rydebäck',
    date: '2006',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Rydebäck.'
  },
  {
    id: 'sep-16',
    title: 'Separatutställning',
    venue: 'Galleri Gamla sta\'n, Helsingborg',
    date: '1995',
    type: 'Solo',
    category: 'separat',
    description: 'Separatutställning i Helsingborg.'
  },
  
  // Gemensamma / Samlingsutställningar
  {
    id: 'gem-1',
    title: 'Kullakonstnärer',
    venue: 'Mölle Stationshus och Annex',
    date: '2025',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning med Kullakonstnärer.'
  },
  {
    id: 'gem-2',
    title: 'Julkonst',
    venue: 'Karantänen, Helsingborgs Konstförening',
    date: '2024',
    type: 'Group',
    category: 'samling',
    description: '50 konstnärer medlemmar i Helsingborgs Konstförening.'
  },
  {
    id: 'gem-3',
    title: 'Julsalong med Kullakonstnärer',
    venue: 'Kulturhuset/Biblioteket, Höganäs',
    date: '2024',
    type: 'Group',
    category: 'samling',
    description: 'Julsalong med Kullakonstnärer.'
  },
  {
    id: 'gem-4',
    title: 'Samlingsutställning',
    venue: 'Karantänen, Helsingborg',
    date: '2023, 2024',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning på Karantänen.'
  },
  {
    id: 'gem-5',
    title: 'Samlingsutställning',
    venue: 'Blå Hallen, Höganäs',
    date: '2024',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Blå Hallen.'
  },
  {
    id: 'gem-6',
    title: 'Konstfestival',
    venue: 'Blå hallen, Höganäs',
    date: '2023',
    type: 'Group',
    category: 'samling',
    description: 'Konstfestival i Höganäs.'
  },
  {
    id: 'gem-7',
    title: 'Samlingsutställning',
    venue: 'Galleri Oscar',
    date: '2022, 2023',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning på Galleri Oscar Mjöhult.'
  },
  {
    id: 'gem-8',
    title: 'Julsalong',
    venue: 'Krapperups Konsthall',
    date: '2022',
    type: 'Group',
    category: 'samling',
    description: 'Julsalong på Krapperups Konsthall.'
  },
  {
    id: 'gem-9',
    title: 'Kulturdagen',
    venue: 'Arild',
    date: '2022',
    type: 'Group',
    category: 'samling',
    description: 'Kulturdagen i Arild.'
  },
  {
    id: 'gem-10',
    title: 'Markaryds Kulturhus',
    venue: 'Markaryds Kulturhus',
    date: '2022',
    type: 'Solo',
    category: 'separat',
    description: 'Utställning 11/9-25/9 2022.'
  },
  {
    id: 'gem-11',
    title: 'Höganäs Julsalong',
    venue: 'Höganäs',
    date: '2021',
    type: 'Group',
    category: 'samling',
    description: 'Julsalong i Höganäs.'
  },
  {
    id: 'gem-12',
    title: 'Gallerinatten',
    venue: 'Rådhuset, Malmö',
    date: '2021',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning under Gallerinatten.'
  },
  {
    id: 'gem-13',
    title: 'Samlingsutställning',
    venue: 'Höganäs museum och konsthall',
    date: '2020',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Höganäs.'
  },
  {
    id: 'gem-14',
    title: 'Jubileumsutställning',
    venue: 'Konsten Helsingborg',
    date: '2018',
    type: 'Group',
    category: 'samling',
    description: 'Jubileumsutställning.'
  },
  {
    id: 'gem-15',
    title: 'Samlingsutställning',
    venue: 'Biblioteksgalleriet, Båstad',
    date: '2018',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Båstad.'
  },
  {
    id: 'gem-16',
    title: 'Samlingsutställning',
    venue: 'Åstorps bibliotek',
    date: '2018',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Åstorp.'
  },
  {
    id: 'gem-17',
    title: 'NVSK Konstrundan',
    venue: 'Landskrona konsthall',
    date: '2013-2019',
    type: 'Group',
    category: 'samling',
    description: 'Årlig konstrunda med NVSK på Landskrona konsthall.'
  },
  {
    id: 'gem-18',
    title: 'Happy Christmas Saloon',
    venue: 'Krapperups konsthall',
    date: '2014, 2015, 2017',
    type: 'Group',
    category: 'samling',
    description: 'Julutställning på Krapperups konsthall.'
  },
  {
    id: 'gem-19',
    title: 'Hidden Art',
    venue: 'Malmö och Höganäs',
    date: '2015',
    type: 'Group',
    category: 'samling',
    description: 'Hidden Art i Malmö och Höganäs.'
  },
  {
    id: 'gem-20',
    title: 'Internationell utställning',
    venue: 'Marziart Internationale Galerie, Hamburg',
    date: '2014',
    type: 'Group',
    category: 'samling',
    description: 'Internationell samlingsutställning i Hamburg.'
  },
  {
    id: 'gem-21',
    title: 'Samlingsutställning',
    venue: 'Galleri UNA, Bjärred',
    date: '2012',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Bjärred.'
  },
  {
    id: 'gem-22',
    title: 'Konstrundan påsk',
    venue: 'Diverse platser',
    date: '2004-2012',
    type: 'Group',
    category: 'samling',
    description: 'Årlig påskkonstrunda.'
  },
  {
    id: 'gem-23',
    title: 'Samlingsutställning',
    venue: 'Galleri Götesdotter, Bjärnum',
    date: '2009',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Bjärnum.'
  },
  {
    id: 'gem-24',
    title: 'Öppet',
    venue: 'Gerlesborgsskolan, Bohuslän',
    date: '2008',
    type: 'Group',
    category: 'samling',
    description: 'Öppen utställning på Gerlesborgsskolan.'
  },
  {
    id: 'gem-25',
    title: 'Samlingsutställning',
    venue: 'Galleri Konstrummet, Stockholm',
    date: '2008, 2012',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Stockholm.'
  },
  {
    id: 'gem-26',
    title: 'Samlingsutställning',
    venue: 'Klippans konsthall',
    date: '2008',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Klippan.'
  },
  {
    id: 'gem-27',
    title: 'Samlingsutställning',
    venue: 'Galleri Hultman, Åstorp',
    date: '2007',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Åstorp.'
  },
  {
    id: 'gem-28',
    title: 'Samlingsutställning',
    venue: 'Köpmansgården, Smygehuk',
    date: '2006',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Smygehuk.'
  },
  {
    id: 'gem-29',
    title: 'Samlingsutställning',
    venue: 'Galleri Konstpunkten, Malmö',
    date: '2004',
    type: 'Group',
    category: 'samling',
    description: 'Samlingsutställning i Malmö.'
  }
];

// Education history
export const educationHistory = [
  { id: '1', institution: 'Konstfack', degree: 'Kandidatprogram i Fri Konst', year: '2015-2018' },
  { id: '2', institution: 'Gerlesborgsskolan', degree: 'Förberedande Konstnärlig Utbildning', year: '2013-2015' },
  { id: '3', institution: 'Stockholms universitet', degree: 'Konstvetenskap, grundkurs', year: '2012' }
];

// Courses offered
export const courses = [
  { 
    id: '1', 
    title: 'Introduktion till akvarell', 
    description: 'En grundkurs för nybörjare som vill lära sig akvarellens grunder.',
    duration: '2 dagar',
    maxParticipants: 8,
    available: true
  },
  { 
    id: '2', 
    title: 'Naturmåleri', 
    description: 'Kurs i att fånga naturen på plats med akvarell.',
    duration: '3 dagar',
    maxParticipants: 6,
    available: true
  },
  { 
    id: '3', 
    title: 'Fågelmåleri', 
    description: 'Specialkurs med fokus på fåglar och rörelse.',
    duration: '1 dag',
    maxParticipants: 10,
    available: false
  }
];

// For initial use before API is connected
export const artworks = defaultArtworks;
export const artistBio = defaultArtistBio;
export const educationData = defaultEducationData;
