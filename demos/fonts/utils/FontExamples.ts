/* Copyright 2017 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/


import { Array1D } from 'deeplearn';

function convertToArray(obj: any) {
  const arr = [];
  for (var i = 0; i < 40; i++) {
    arr.push(obj[i]);
  }
  return Array1D.new(arr);
}


export const serif = convertToArray({
  "0": 0.03710492327809334,
  "1": -0.008139342069625854,
  "2": -0.02383829653263092,
  "3": -0.008982698433101177,
  "4": -0.1778210699558258,
  "5": -0.05740843340754509,
  "6": 0.07704125344753265,
  "7": -0.0006905178306624293,
  "8": 0.07691150903701782,
  "9": 0.03511607274413109,
  "10": 0.08145121484994888,
  "11": -0.05160701647400856,
  "12": -0.010720258578658104,
  "13": 0.034953173249959946,
  "14": -0.03832511231303215,
  "15": 0.18156598508358002,
  "16": 0.018036816269159317,
  "17": -0.019042057916522026,
  "18": 0.002650525886565447,
  "19": 0.06628520786762238,
  "20": -0.00912405550479889,
  "21": -0.031107895076274872,
  "22": 0.02655569091439247,
  "23": -0.048792093992233276,
  "24": 0.05342278629541397,
  "25": -0.0027352087199687958,
  "26": -0.01972193829715252,
  "27": -0.06445850431919098,
  "28": -0.05776624754071236,
  "29": 0.015628423541784286,
  "30": 0.09913289546966553,
  "31": -0.012806365266442299,
  "32": -0.14301174879074097,
  "33": 0.10579687356948853,
  "34": -0.09867534041404724,
  "35": -0.019691845402121544,
  "36": 0.03786368668079376,
  "37": 0.08336587250232697,
  "38": -0.09530198574066162,
  "39": 0.07950644195079803
});

export const serifLight = convertToArray({
  "0": -0.02165570668876171,
  "1": -0.005108066834509373,
  "2": 0.06902500241994858,
  "3": 0.07107870280742645,
  "4": -0.12100136280059814,
  "5": -0.0013336149277165532,
  "6": 0.06117886304855347,
  "7": 0.009825940243899822,
  "8": 0.08796881884336472,
  "9": 0.029554231092333794,
  "10": -0.012214310467243195,
  "11": -0.06349798291921616,
  "12": -0.005215914454311132,
  "13": -0.06011629477143288,
  "14": -0.07139676064252853,
  "15": 0.06716731190681458,
  "16": -0.01065546739846468,
  "17": -0.05936019495129585,
  "18": 0.011764015071094036,
  "19": 0.010934042744338512,
  "20": -0.016946941614151,
  "21": -0.05346294865012169,
  "22": -0.03881118819117546,
  "23": -0.012340055778622627,
  "24": 0.09398457407951355,
  "25": 0.01659213751554489,
  "26": 0.12937070429325104,
  "27": -0.002807029988616705,
  "28": -0.05001555010676384,
  "29": 0.037962913513183594,
  "30": -0.061888135969638824,
  "31": -0.037659864872694016,
  "32": -0.03117079846560955,
  "33": 0.007282746024429798,
  "34": 0.01729695498943329,
  "35": -0.029918067157268524,
  "36": 0.04659431800246239,
  "37": 0.023710312321782112,
  "38": -0.07451765984296799,
  "39": 0.034339066594839096
})

export const serifLightItalic = convertToArray({
  "0": -0.05060652270913124,
  "1": 0.007013191934674978,
  "2": 0.061512306332588196,
  "3": 0.03931022807955742,
  "4": -0.09484537690877914,
  "5": -0.013742517679929733,
  "6": 0.11154411733150482,
  "7": 0.03917686268687248,
  "8": 0.08599016815423965,
  "9": 0.017024585977196693,
  "10": 0.020140206441283226,
  "11": -0.13651837408542633,
  "12": -0.01676410250365734,
  "13": -0.06078571453690529,
  "14": -0.07446750998497009,
  "15": 0.054087355732917786,
  "16": -0.002002162393182516,
  "17": -0.0665508583188057,
  "18": 0.0025780899450182915,
  "19": 0.0023329516407102346,
  "20": 0.014013747684657574,
  "21": -0.08018416166305542,
  "22": -0.042324427515268326,
  "23": 0.03550040349364281,
  "24": 0.05806473642587662,
  "25": -0.013847771100699902,
  "26": 0.09332431852817535,
  "27": 0.018480097874999046,
  "28": -0.019027886912226677,
  "29": 0.013780350796878338,
  "30": -0.05185095965862274,
  "31": -0.05625378340482712,
  "32": -0.030851634219288826,
  "33": 0.0050457981415092945,
  "34": 0.05198929086327553,
  "35": -0.03590380400419235,
  "36": 0.021344471722841263,
  "37": 0.016072237864136696,
  "38": -0.03857357054948807,
  "39": -0.014168269000947475
});

export const serifItalic = convertToArray({
  "0": -0.00709411920979619,
  "1": -0.002269274089485407,
  "2": -0.046097204089164734,
  "3": -0.03114948980510235,
  "4": -0.18426690995693207,
  "5": -0.08408986777067184,
  "6": 0.1050587147474289,
  "7": 0.03995714336633682,
  "8": 0.03999888896942139,
  "9": 0.015466969460248947,
  "10": 0.10908421874046326,
  "11": -0.11222759634256363,
  "12": -0.02987774834036827,
  "13": 0.02079731971025467,
  "14": -0.021174294874072075,
  "15": 0.19685451686382294,
  "16": 0.007196167483925819,
  "17": -0.015365112572908401,
  "18": -0.02974700555205345,
  "19": 0.052896786481142044,
  "20": 0.01554524153470993,
  "21": -0.0604700930416584,
  "22": 0.007749530021101236,
  "23": -0.06737610697746277,
  "24": 0.045028235763311386,
  "25": 0.004034052137285471,
  "26": -0.0563509538769722,
  "27": -0.07479672878980637,
  "28": -0.003174285404384136,
  "29": 0.007626830134540796,
  "30": 0.06840822845697403,
  "31": -0.012914231047034264,
  "32": -0.12397700548171997,
  "33": 0.10521336644887924,
  "34": -0.08818143606185913,
  "35": -0.012100323103368282,
  "36": 0.03144967928528786,
  "37": 0.07083606719970703,
  "38": -0.07980912923812866,
  "39": 0.063755102455616
});

export const serifBold = convertToArray({
  "0": -0.032380275428295135,
  "1": -0.0010279326234012842,
  "2": 0.012437611818313599,
  "3": 0.09716641157865524,
  "4": -0.035750869661569595,
  "5": 0.00880436971783638,
  "6": 0.019641777500510216,
  "7": 0.0928424671292305,
  "8": 0.026407748460769653,
  "9": 0.05984069034457207,
  "10": 0.020050207152962685,
  "11": 0.00457189092412591,
  "12": 0.0060768346302211285,
  "13": -0.022614598274230957,
  "14": -0.08182959258556366,
  "15": 0.07676200568675995,
  "16": 0.04329368844628334,
  "17": 0.006094778887927532,
  "18": -0.02188078686594963,
  "19": 0.08436089754104614,
  "20": 0.04089401289820671,
  "21": 0.058309540152549744,
  "22": -0.007306405808776617,
  "23": -0.00898111704736948,
  "24": 0.033685166388750076,
  "25": -0.028338845819234848,
  "26": 0.14441905915737152,
  "27": 0.0009468734497204423,
  "28": -0.030561979860067368,
  "29": 0.023246319964528084,
  "30": -0.01817786693572998,
  "31": -0.04900963604450226,
  "32": 0.020408552139997482,
  "33": 0.02382250875234604,
  "34": -0.045390624552965164,
  "35": -0.07109241932630539,
  "36": 0.004320087376981974,
  "37": 0.029228318482637405,
  "38": -0.10679484158754349,
  "39": -0.004532450810074806
});

export const serifBoldItalic = convertToArray({
  "0": -0.005404798313975334,
  "1": 0.015909232199192047,
  "2": 0.030216751620173454,
  "3": 0.06970373541116714,
  "4": -0.020475931465625763,
  "5": 0.0007763669127598405,
  "6": 0.0702093169093132,
  "7": 0.12128908187150955,
  "8": 0.04120710492134094,
  "9": 0.05330699309706688,
  "10": 0.028894616290926933,
  "11": -0.08006871491670609,
  "12": -0.007959316484630108,
  "13": -0.013250164687633514,
  "14": -0.08184877783060074,
  "15": 0.05818215012550354,
  "16": 0.09705940634012222,
  "17": -0.012044970877468586,
  "18": -0.02975398302078247,
  "19": 0.07639876753091812,
  "20": 0.07669107615947723,
  "21": 0.00033453089417889714,
  "22": -0.0014346805401146412,
  "23": 0.022763067856431007,
  "24": 0.01775662787258625,
  "25": -0.007383543998003006,
  "26": 0.139811709523201,
  "27": 0.0005617057904601097,
  "28": -0.0053567830473184586,
  "29": -0.018945571035146713,
  "30": -0.030951762571930885,
  "31": -0.06757701188325882,
  "32": 0.02708236128091812,
  "33": 0.02010318823158741,
  "34": -0.006006164010614157,
  "35": -0.04669727757573128,
  "36": -0.01931954361498356,
  "37": 0.018009185791015625,
  "38": -0.07795897126197815,
  "39": -0.06815727055072784
});

export const serifBlack = convertToArray({
  "0": 0.0909757912158966,
  "1": 0.008733878843486309,
  "2": -0.04528074711561203,
  "3": 0.007948985323309898,
  "4": -0.10172048956155777,
  "5": 0.013342092745006084,
  "6": 0.0696997344493866,
  "7": 0.07986725121736526,
  "8": -0.007284766994416714,
  "9": 0.06710667908191681,
  "10": 0.09672858566045761,
  "11": -0.0025160249788314104,
  "12": -0.012756502255797386,
  "13": 0.0337119922041893,
  "14": -0.019966337829828262,
  "15": 0.12759369611740112,
  "16": 0.12241878360509872,
  "17": -0.04895523190498352,
  "18": -0.06506077200174332,
  "19": 0.11419368535280228,
  "20": 0.06340686976909637,
  "21": 0.054575882852077484,
  "22": 0.10135798901319504,
  "23": -0.05459721386432648,
  "24": -0.07511366158723831,
  "25": -0.03464489057660103,
  "26": -0.00018063472816720605,
  "27": -0.04369136691093445,
  "28": -0.08150603622198105,
  "29": -0.03548838570713997,
  "30": 0.17928309738636017,
  "31": -0.018894895911216736,
  "32": -0.15055546164512634,
  "33": 0.08058996498584747,
  "34": -0.17565962672233582,
  "35": -0.09405029565095901,
  "36": -0.03550685942173004,
  "37": 0.07373711466789246,
  "38": -0.09239938110113144,
  "39": -0.006780410651117563
});

export const serifBlackItalic = convertToArray({
  "0": 0.05307462438941002,
  "1": 0.02597457356750965,
  "2": -0.05974569171667099,
  "3": -0.01363010797649622,
  "4": -0.09344698488712311,
  "5": -0.01847984828054905,
  "6": 0.08656280487775803,
  "7": 0.09641542285680771,
  "8": -0.03934771195054054,
  "9": 0.07055818289518356,
  "10": 0.11087866872549057,
  "11": -0.02200898714363575,
  "12": -0.006912342272698879,
  "13": 0.021902868524193764,
  "14": -0.032483767718076706,
  "15": 0.14053502678871155,
  "16": 0.1258542239665985,
  "17": -0.01499226875603199,
  "18": -0.07484503090381622,
  "19": 0.11951009929180145,
  "20": 0.06834398955106735,
  "21": 0.020606260746717453,
  "22": 0.1040756106376648,
  "23": -0.06514193117618561,
  "24": -0.0850527212023735,
  "25": -0.018303850665688515,
  "26": -0.03782316669821739,
  "27": -0.05871974676847458,
  "28": -0.05106407403945923,
  "29": -0.056275997310876846,
  "30": 0.153719961643219,
  "31": -0.04409332945942879,
  "32": -0.11630933731794357,
  "33": 0.03750910982489586,
  "34": -0.14426365494728088,
  "35": -0.10314073413610458,
  "36": -0.03219449892640114,
  "37": 0.05933740735054016,
  "38": -0.07642091065645218,
  "39": -0.030303338542580605
});

//
// Sans serif
//

export const sans = convertToArray({
  "0": 0.03298640996217728,
  "1": 0.02789715863764286,
  "2": -0.02125944197177887,
  "3": -0.04380541294813156,
  "4": -0.206729918718338,
  "5": -0.0515143983066082,
  "6": 0.0639917403459549,
  "7": 0.007101300172507763,
  "8": 0.017800621688365936,
  "9": 0.020246872678399086,
  "10": 0.03949364274740219,
  "11": -0.06472498178482056,
  "12": 0.002623029751703143,
  "13": 0.033676501363515854,
  "14": -0.07566492259502411,
  "15": 0.14330683648586273,
  "16": 0.06994079053401947,
  "17": -0.01669798046350479,
  "18": -0.000012088377843610942,
  "19": 0.07450989633798599,
  "20": -0.028981855139136314,
  "21": 0.09149467200040817,
  "22": 0.04314282909035683,
  "23": -0.055428460240364075,
  "24": 0.05030016601085663,
  "25": -0.024598656222224236,
  "26": -0.034813292324543,
  "27": 0.05295879766345024,
  "28": -0.03871896117925644,
  "29": 0.03234470635652542,
  "30": 0.07791033387184143,
  "31": -0.047650210559368134,
  "32": -0.09869896620512009,
  "33": 0.12859901785850525,
  "34": -0.1076827421784401,
  "35": 0.05181201547384262,
  "36": -0.0101372255012393,
  "37": 0.07353256642818451,
  "38": 0.01528282929211855,
  "39": 0.07468537241220474
});

export const sansLight = convertToArray({
  "0": -0.09121435880661011,
  "1": -0.11000031977891922,
  "2": 0.11123226583003998,
  "3": 0.02689106948673725,
  "4": -0.18462437391281128,
  "5": -0.13946110010147095,
  "6": 0.00970334280282259,
  "7": -0.13767202198505402,
  "8": 0.06033879891037941,
  "9": -0.13666105270385742,
  "10": -0.031924210488796234,
  "11": -0.13970430195331573,
  "12": -0.08186255395412445,
  "13": 0.04972504824399948,
  "14": -0.09534087777137756,
  "15": 0.05014492943882942,
  "16": 0.007156982086598873,
  "17": -0.12747839093208313,
  "18": 0.03861670941114426,
  "19": 0.0012702945386990905,
  "20": -0.03561707213521004,
  "21": 0.009451605379581451,
  "22": 0.06686616688966751,
  "23": 0.034677669405937195,
  "24": 0.1173168495297432,
  "25": -0.12231075763702393,
  "26": 0.030756326392292976,
  "27": 0.11412730067968369,
  "28": -0.010537946596741676,
  "29": 0.1162334457039833,
  "30": -0.1213046982884407,
  "31": 0.06440857797861099,
  "32": -0.03473088890314102,
  "33": 0.05771194025874138,
  "34": -0.007654442917555571,
  "35": 0.032886434346437454,
  "36": 0.14352823793888092,
  "37": 0.004459265153855085,
  "38": -0.023728683590888977,
  "39": 0.03019704483449459
})

//
// Goofy
//

export const arched = convertToArray({
  "0": 0.08068722486495972,
  "1": 0.11096498370170593,
  "2": 0.0868859589099884,
  "3": -0.0018017578404396772,
  "4": -0.08820706605911255,
  "5": 0.07794561982154846,
  "6": 0.09056331217288971,
  "7": 0.00644794013351202,
  "8": 0.0859038457274437,
  "9": -0.07755837589502335,
  "10": 0.06639783829450607,
  "11": 0.01411781832575798,
  "12": 0.08381171524524689,
  "13": -0.04475760832428932,
  "14": -0.040304794907569885,
  "15": 0.15967315435409546,
  "16": 0.02296677604317665,
  "17": 0.0858101025223732,
  "18": 0.009088289923965931,
  "19": -0.014088505879044533,
  "20": -0.1766888052225113,
  "21": -0.06666982918977737,
  "22": -0.009641853161156178,
  "23": -0.015128687024116516,
  "24": -0.011351611465215683,
  "25": -0.08816853165626526,
  "26": -0.028330257162451744,
  "27": 0.19118927419185638,
  "28": -0.001842609839513898,
  "29": 0.1304606795310974,
  "30": -0.006931955926120281,
  "31": 0.06936698406934738,
  "32": 0.13879303634166718,
  "33": -0.011983582749962807,
  "34": -0.005721193738281727,
  "35": 0.045184869319200516,
  "36": -0.023838164284825325,
  "37": 0.016706416383385658,
  "38": -0.030130060389637947,
  "39": 0.0886809304356575
});

export const square = convertToArray({
  "0": -0.044628869742155075,
  "1": -0.014977334067225456,
  "2": -0.03853307291865349,
  "3": -0.07073729485273361,
  "4": -0.033562421798706055,
  "5": -0.20116819441318512,
  "6": 0.12035515904426575,
  "7": -0.11812747269868851,
  "8": 0.019388878718018532,
  "9": -0.19194547832012177,
  "10": -0.03408190608024597,
  "11": -0.13011613488197327,
  "12": -0.019782204180955887,
  "13": -0.09971821308135986,
  "14": -0.067976213991642,
  "15": 0.1602993756532669,
  "16": 0.1030825674533844,
  "17": -0.11045809090137482,
  "18": 0.18887414038181305,
  "19": -0.0003990798140875995,
  "20": -0.07403284311294556,
  "21": 0.08555496484041214,
  "22": -0.10945939272642136,
  "23": -0.021447191014885902,
  "24": -0.13518545031547546,
  "25": -0.04154079779982567,
  "26": 0.16282615065574646,
  "27": 0.32557758688926697,
  "28": -0.12240246683359146,
  "29": 0.10209369659423828,
  "30": -0.25086429715156555,
  "31": 0.14640894532203674,
  "32": 0.28280726075172424,
  "33": -0.10215779393911362,
  "34": -0.0025975832249969244,
  "35": 0.04110243543982506,
  "36": 0.11168057471513748,
  "37": 0.07137221843004227,
  "38": -0.03359317034482956,
  "39": 0.1573416292667389
})

export const dotMatrix = convertToArray({
  "0": 0.06061501428484917,
  "1": -0.00046571530401706696,
  "2": 0.02465975098311901,
  "3": 0.0944611057639122,
  "4": 0.06662742793560028,
  "5": -0.04873237386345863,
  "6": 0.028600286692380905,
  "7": -0.18410305678844452,
  "8": -0.002405391540378332,
  "9": -0.058848004788160324,
  "10": 0.018442483618855476,
  "11": 0.09479508548974991,
  "12": 0.04671400412917137,
  "13": -0.15327095985412598,
  "14": 0.00900222733616829,
  "15": 0.01920619048178196,
  "16": -0.06917529553174973,
  "17": 0.07427556067705154,
  "18": -0.02743423730134964,
  "19": -0.10414252430200577,
  "20": -0.03533432260155678,
  "21": -0.10659786313772202,
  "22": 0.03354411572217941,
  "23": -0.06421948224306107,
  "24": 0.20326244831085205,
  "25": -0.023451726883649826,
  "26": -0.02282084710896015,
  "27": 0.03022465854883194,
  "28": -0.18543776869773865,
  "29": 0.039307981729507446,
  "30": 0.07618775218725204,
  "31": -0.06732140481472015,
  "32": 0.14345170557498932,
  "33": -0.08569326996803284,
  "34": 0.030835865065455437,
  "35": 0.06298132985830307,
  "36": -0.06231020390987396,
  "37": -0.044919345527887344,
  "38": 0.03644758462905884,
  "39": 0.01696920581161976
});

export const casual = convertToArray({
  "0": 0.03756021708250046,
  "1": -0.049130361527204514,
  "2": -0.020964130759239197,
  "3": -0.10301123559474945,
  "4": 0.030872398987412453,
  "5": -0.13089466094970703,
  "6": 0.0821889117360115,
  "7": -0.014646596275269985,
  "8": -0.07288747280836105,
  "9": 0.07340757548809052,
  "10": 0.01331001054495573,
  "11": -0.07899730652570724,
  "12": -0.009709817357361317,
  "13": -0.04683038592338562,
  "14": 0.0635698065161705,
  "15": 0.15249183773994446,
  "16": -0.0094428900629282,
  "17": 0.0296184029430151,
  "18": 0.004796696361154318,
  "19": -0.03856264799833298,
  "20": 0.17207364737987518,
  "21": -0.019152291119098663,
  "22": 0.03103218786418438,
  "23": -0.00679372251033783,
  "24": -0.08234084397554398,
  "25": 0.0634969100356102,
  "26": -0.029181338846683502,
  "27": -0.05958503857254982,
  "28": -0.013522081077098846,
  "29": 0.026348652318120003,
  "30": 0.028605520725250244,
  "31": -0.04841816425323486,
  "32": -0.008032144978642464,
  "33": 0.05754653736948967,
  "34": 0.13908430933952332,
  "35": 0.024616137146949768,
  "36": -0.15661291778087616,
  "37": 0.07799030840396881,
  "38": 0.13966602087020874,
  "39": -0.053386785089969635
});


export const crispSerif = convertToArray({
  "0": -0.01171221025288105,
  "1": 0.019898392260074615,
  "2": 0.027197811752557755,
  "3": 0.01895751617848873,
  "4": -0.05472269281744957,
  "5": -0.019666939973831177,
  "6": 0.08419313281774521,
  "7": 0.029595153406262398,
  "8": 0.10542188584804535,
  "9": -0.021925846114754677,
  "10": -0.068334199488163,
  "11": -0.1323370486497879,
  "12": 0.027670003473758698,
  "13": 0.1267889440059662,
  "14": -0.07596345245838165,
  "15": 0.12109840661287308,
  "16": 0.040586065500974655,
  "17": 0.009729587472975254,
  "18": -0.011304029263556004,
  "19": -0.016625354066491127,
  "20": -0.044383395463228226,
  "21": 0.030728494748473167,
  "22": -0.05700404942035675,
  "23": -0.08779925853013992,
  "24": 0.0031437589786946774,
  "25": 0.030230635777115822,
  "26": -0.012705705128610134,
  "27": -0.024217743426561356,
  "28": -0.001132326084189117,
  "29": -0.024262459948658943,
  "30": 0.13344348967075348,
  "31": 0.11055535823106766,
  "32": -0.1263151466846466,
  "33": 0.08772098273038864,
  "34": -0.09958085417747498,
  "35": -0.048072200268507004,
  "36": 0.15588171780109406,
  "37": 0.06908521056175232,
  "38": -0.07728306949138641,
  "39": 0.028489382937550545
});
