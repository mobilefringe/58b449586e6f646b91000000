function init() {
    $('<div class="loader_backdrop"><div class="loader">Loading...</div></div>').appendTo(document.body);
    
    //Using i18n for localization, for more info please visit http://i18next.com/
    i18n.init({preload: [getStorage().primary_locale,getStorage().secondary_locale],resGetPath: '../__lng__.json',fallbackLng: false }, function(t) {
        var current_locale = "";
        if(typeof(Cookies.get('current_locale')) != 'undefined' ){
            current_locale = Cookies.get('current_locale')
        }
        if(current_locale == Cookies.get('primary_locale')){
            setPrimaryLanguage();
        }else{
            setSecondaryLanguage();
        }
    });
    
    // If there is no language set it to the primary locale.
    if (!Cookies.get('current_locale')) {
        setPrimaryLanguage();
    }
    
    function setCurrentLocale(locale){
        Cookies.set('current_locale', locale);
    }

    $("#brand_select").on('change', function() {            
        if ($(this).val() != ""){
            window.location = "/stores/" + $(this).val();    
        }
    });  

    $("#locale_select").on('change', function() {                        
        window.location.href = "?locale=" + $(this).val();    
    }); 
    
    if(Cookies.get('current_locale') == "en-CA"){
        $("#brand_select").prepend("<option selected>Brands</option>");   
        $("#locale_select").val("en");
    }
    if(Cookies.get('current_locale') == "fr-CA"){
        $("#brand_select").prepend("<option selected>Boutiques</option>"); 
        $("#locale_select").val("fr");
    }
    
    $(".long_feature_box").hover(function() {
        $(this).find(".long_feature_label").animate({
            "top": "-=81%"
        }, 500)
    }, function() {
        $(this).find(".long_feature_label").animate({
            "top": "+=81%"
        }, 500)
    });
    
    //Campaign Monitor Sign Up
    $('#subForm').submit(function (e) {
        if ($("#agree_terms").prop("checked") != true){
            alert("Please agree to the term and conditions.");
            $("#agree_terms").focus();
            return false;
        }
        e.preventDefault();
        $.getJSON(
            this.action + "?callback=?",
            $(this).serialize(),
            function (data) {
                if (data.Status === 400) {
                    alert("Please try again later.");
                } else { // 200
                    $('#subForm').trigger('reset');
                    $("#success_subscribe").fadeIn();
                    
                }
        });
    });
}

function show_content(){
    $(".yield").css({visibility: "visible"});
    $(".loader_backdrop").remove();
    
    var header_stores = getStoresList();
    renderStoreList('#brand_select','#brand_select_template', header_stores, "stores");
    
    renderHomeHours();
    
    var prop_details = getPropertyDetails();
    renderPropertyDetails('#prop_phone_container', '#prop_phone_template', prop_details);
    
    var feature_items = getFeatureList();
    var one_item = feature_items.slice(0,1);
    var two_items = feature_items.slice(1,3);
    if(Cookies.get('current_locale') == "en-CA"){
        renderFeatureItems('#feature_item','#feature_item_template', one_item);
        renderFeatureItems('#home_feature','#home_feature_template', two_items);            
    }
    if(Cookies.get('current_locale') == "fr-CA"){
        renderFeatureItems('#feature_item_fr','#feature_item_template_fr', one_item);
        renderFeatureItems('#home_feature_fr','#home_feature_template_fr', two_items);   
    }
}