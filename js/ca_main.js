REFS = [boston, montreal, dc];

function updateBSA() {
    // if ht & wt exist, calculate the BSA
    var ht, wt, method;
    ht = parseFloat($('#txtHT').val());
    wt = parseFloat($('#txtWT').val());
    method = $('#cmbBSA').val();
    if (ht && wt) {
        BSA = CalcBSA(ht, wt, method).toFixed(2);
        BSA = +BSA; //type converts back to 'number'; ensures we are making all calcs from here on using the displayed bsa
    } else if (wt && method == 'Dreyer') {
        BSA = CalcBSA('', wt, method).toFixed(2);
        BSA = +BSA; //type converts back to 'number', see note above
    } else {
        return;
    }
    $('#BSA').html(BSA.toFixed(2) + ' M<sup>2</sup>');
    calculateZScores();

} //end updateBSA

function displayRef() {
    $('.title').text(REF.citation.title);
    $('.linkUrl').attr('href', REF.citation.linkUrl);
    $('.authors').text(REF.citation.authors);
    $('.journal').text(REF.citation.journal);
    //and display the code samples
    $('#code_sample').show();
    $('pre').hide();
    $('pre.' + REF.id).show();

} //end displayRef fx

function updateRef() {
    var use_ref
    //determine which reference was selected
    use_ref = $('#cmbUseRef').val();
    if (use_ref !== '') {
        REF = REFS[use_ref];
        displayRef();
        //add logic to update BSA formula
        $('#cmbBSA').val(REF['bsaFormula']);
        calculateZScores();

    } else {
        return;
    }
} //end updateRef

function calculateZScores() {
    // main function
    if (REF) {
        var allSites = ['lmca', 'lad', 'circ', 'rca', 'mid_rca', 'dist_rca'];
        $.each(allSites, function(key, val) {
            if (val in REF) {
                $('.' + val).show();
                if (BSA) {
                    $('#txt' + val).change();
                }
            }
            else {
                $('.' + val).hide();
                $('#' + val + 'z').text('').removeClass('normal borderline mild moderate severe').attr('title', '');
            }
        });
    }
} //end calculateScores

function updateSite(site, score) {
    if (score) {
        //debug
        //alert('in function "updateSite"')
        var z = REF[site]['zscore'](score);
        //debug
        //alert(site + ': ' + z.toFixed(2))
        $('#' + site + 'z').text(z.toFixed(2)).
            removeClass('normal borderline mild moderate severe').
            addClass(zscoreFlag(z)).attr('title', (poz(z) * 100).toFixed(2) + '%-ile');
    }
} //end updateSite

function resetForm() {
    $('.results').text('').
    removeClass('normal borderline mild moderate severe');
    $('.lmca, .lad, .circ, .rca, .mid_rca, .dist_rca').show();
    $('.title, .authors, .journal').text('');
    $('pre').hide();

} //end resetForm