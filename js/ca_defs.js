//globals
var BSA, LIMIT, REFS, REF;

LIMIT = 2.0; // z-score to use for upper/lower limits


/*
CONSTRUCTOR FUNCTIONS
Assumes BSA is a global variable
*/

function Cor_b(o) {
    //these are bsa-adjusted coronaries a-la Boston
    this.a1 = o.a1;
    this.b1 = o.b1;
    this.exp = o.exp;
    this.a2 = o.a2;
    this.b2 = o.b2;
}
Cor_b.prototype.mean = function() {
    // converts cm to mm, i.e., manuscript deals with 'cm', I want to use 'mm'
    return 10 * (this.a1 + this.b1 * Math.pow(BSA, this.exp));
}
Cor_b.prototype.sd = function() {
    return 10 * (this.a2 + this.b2 * BSA);
}
Cor_b.prototype.zscore = function(score) {
    return (score - this.mean()) / this.sd();
}
Cor_b.prototype.uln = function() {
    return this.mean() + LIMIT * this.sd();
}
Cor_b.prototype.lln = function() {
    return this.mean() - LIMIT * this.sd();
}


function Cor_dc(o) {
    //these are bsa-adjusted coronaries a-la CNMC, Washington D.C.
    this.beta1 = o.beta1;
    this.beta2 = o.beta2;
    this.mse = o.mse;
}
Cor_dc.prototype.logMean = function() {
    return this.beta1 + this.beta2 * Math.log(BSA);
}
Cor_dc.prototype.zscore = function(score) {
    //have to convert mm to cm, i.e., the equatons expect 'cm', I want us to use 'mm'
    return (Math.log(score / 10) - this.logMean()) / Math.sqrt(this.mse);
}
Cor_dc.prototype.mean = function() {
    return 10 * Math.exp(this.logMean());
}
Cor_dc.prototype.uln = function() {
    return Math.exp(this.logMean() + LIMIT * Math.sqrt(this.mse)) * 10
}
Cor_dc.prototype.lln = function() {
    return Math.exp(this.logMean() - LIMIT * Math.sqrt(this.mse)) * 10
}



function Cor_m(o) {
    //these are bsa-adjusted coronaries a-la Montreal
    this.a1 = o.a1;
    this.b1 = o.b1;
    this.a2 = o.a2;
    this.b2 = o.b2;
}
Cor_m.prototype.mean = function() {
    return this.a1 + this.b1 * Math.sqrt(BSA);
};
Cor_m.prototype.sd = function() {
    return this.a2 + this.b2 * Math.sqrt(BSA);
};
Cor_m.prototype.zscore = function(score) {
    return (score - this.mean()) / this.sd();
};
Cor_m.prototype.uln = function() {
    return this.mean() + LIMIT * this.sd();
};
Cor_m.prototype.lln = function() {
    return this.mean() - LIMIT * this.sd();
};


/*
REFERENCE OBJECTS
*/
var montreal = {
    id: "Montreal",
    name: 'Montreal (JASE, 2011)', //will show in drop-down list
    citation: {
        title: "New equations and a critical appraisal of coronary artery Z scores in healthy children.",
        authors: "Dallaire F, Dahdah N.",
        journal: "J Am Soc Echocardiogr. 2011 Jan;24(1):60-74. Epub 2010 Nov 13.",
        linkUrl: "http://www.ncbi.nlm.nih.gov/pubmed/21074965"
    },
    lmca: new Cor_m({ a1: -0.1817, b1: 2.9238, a2: 0.1801, b2: 0.2530 }),
    lad: new Cor_m({ a1: -0.1502, b1: 2.2672, a2: 0.1709, b2: 0.2293 }),
    circ: new Cor_m({ a1: -0.2716, b1: 2.3458, a2: 0.1142, b2: 0.3423 }),
    rca: new Cor_m({ a1: -0.3039, b1: 2.7521, a2: 0.1626, b2: 0.2881 }),
    mid_rca: new Cor_m({ a1: -0.3060, b1: 2.4078, a2: 0.1324, b2: 0.3259 }),
    dist_rca: new Cor_m({ a1: -0.3185, b1: 2.3295, a2: 0.1099, b2: 0.3198 })
};

var dc = {
    id: "DC",
    name: "Washington, D.C. (JASE, 2009)",
    citation: {
        title: 'Coronary artery Z score regression equations and calculators derived from a large heterogeneous population of children undergoing echocardiography.',
        authors: 'Olivieri L, Arling B, Friberg M, Sable C.',
        journal: 'J Am Soc Echocardiogr. 2009 Feb;22(2):159-64. Epub 2008 Dec 11',
        linkUrl: 'http://www.ncbi.nlm.nih.gov/pubmed/19084373'
    },
    lmca: new Cor_dc({ beta1: -1.31625, beta2: 0.37442, mse: 0.028467 }),
    lad: new Cor_dc({ beta1: -1.50927, beta2: 0.41164, mse: 0.033031 }),
    rca: new Cor_dc({ beta1: -1.46115, beta2: 0.37870, mse: 0.040172 })
};

var boston = {
    id: "Boston",
    name: "Boston (Circ. 2007)",
    citation: {
        title: 'Coronary artery involvement in children with Kawasaki disease: risk factors from analysis of serial normalized measurements.',
        authors: 'McCrindle BW, Li JS, Minich LL, Colan SD, Atz AM, Takahashi M, Vetter VL, Gersony WM, Mitchell PD, Newburger JW; Pediatric Heart Network Investigators.',
        journal: 'Circulation. 2007 Jul 10;116(2):174-9. Epub 2007 Jun 18.',
        linkUrl: 'http://www.ncbi.nlm.nih.gov/pubmed/17576863'
    },
    lmca: new Cor_b({ a1: -0.02887, b1: 0.31747, exp: 0.36008, a2: 0.03040, b2: 0.01514 }),
    lad: new Cor_b({ a1: -0.02852, b1: 0.26108, exp: 0.37893, a2: 0.01465, b2: 0.01996 }),
    rca: new Cor_b({ a1: -0.02756, b1: 0.26117, exp: 0.39992, a2: 0.02407, b2: 0.01597 })
};
