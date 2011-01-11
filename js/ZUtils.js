function CalcBSA(ht, wt, BSAMethod) {
    /// <summary>returns the body surface area in meters^2</summary>
    /// <param name="ht">height, units = cm</param>
    /// <param name="wt">weight, units = kg</param>
    /// <param name="BSAMethod">any of the following:DuBois, Haycock, Gehan, Mosteller, Boyd, or Dreyer</param>
    /// <returns>Number</returns>
    switch (BSAMethod) {
    case "DuBois":
        return 0.007184 * Math.pow(ht, 0.725) * Math.pow(wt, 0.425);
    case "Haycock":
        return 0.024265 * Math.pow(ht, 0.3964) * Math.pow(wt, 0.5378);
    case "Gehan":
        return 0.0235 * Math.pow(ht, 0.42246) * Math.pow(wt, 0.51456);
    case "Mosteller":
        return Math.sqrt((ht * wt) / 3600);
    case "Boyd":
        wt = wt * 1000;
        var exponent = 0.7285 - 0.0188 * (Math.LOG10E * Math.log(wt)); //necessary to get the Log base 10 of (wt)
        return 0.0003207 * Math.pow(ht, 0.3) * Math.pow(wt, exponent);
    case "Dreyer":
        return 0.1 * Math.pow(wt, (2 / 3));
    }//end switch

}// end BSA function
//Percentiles function for z-scores (adapted by Dan Dyar)
//The following JavaScript functions for calculating normal and
//chi-square probabilities and critical values were adapted by
//John Walker from C implementations
//written by Gary Perlman of Wang Institute, Tyngsboro, MA
//01879.  Both the original C code and this JavaScript edition
//are in the public domain.

function calcPercentile(z) {
    var qz;
    if (z === 0) {qz = 0.5;}
    else if (z > -6 && z < 6) {
        qz = poz(z);}
    else {//the z score is beyond 6
        return "*";}
    return (qz * 100).toFixed(2);

}//end Percentiles fx

//poz ---  probability of normal z value
function poz(z) {
    var y, x, w;
    var Z_MAX = 6;
    if (z == 0.0) {
        x = 0.0;
    } else {
        y = 0.5 * Math.abs(z);
        if (y > (Z_MAX * 0.5)) {
            x = 1.0;
        } else if (y < 1.0) {
            w = y * y;
            x = ((((((((0.000124818987 * w
                     - 0.001075204047) * w + 0.005198775019) * w
                     - 0.019198292004) * w + 0.059054035642) * w
                     - 0.151968751364) * w + 0.319152932694) * w
                     - 0.531923007300) * w + 0.797884560593) * y * 2.0;
        } else {
            y -= 2.0;
            x = (((((((((((((-0.000045255659 * y
                           + 0.000152529290) * y - 0.000019538132) * y
                           - 0.000676904986) * y + 0.001390604284) * y
                           - 0.000794620820) * y - 0.002034254874) * y
                           + 0.006549791214) * y - 0.010557625006) * y
                           + 0.011630447319) * y - 0.009279453341) * y
                           + 0.005353579108) * y - 0.002141268741) * y
                           + 0.000535310849) * y + 0.999936657524;
        }
    }
    return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
}// end poz

//ZscoreFlag function
//used to set the CSS class of the element displaying the computed z score
function zscoreFlag(zScore) {
    if (zScore >= 1.65 && zScore < 1.96 || zScore > -1.96 && zScore <= -1.65) {
        return "borderline";
    }
    else if (zScore >= 1.96 && zScore < 3 || zScore > -3 && zScore <= -1.96) {
        return "mild";
    }
    else if (zScore >= 3 && zScore < 4 || zScore > -4 && zScore <= -3) {
        return "moderate";
    }
    else if (zScore >= 4 || zScore <= -4) {
        return "severe";
    }
    return "normal";
}//end zscore flag function
