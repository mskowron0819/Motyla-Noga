<?php
require realpath(dirname(__FILE__)).DIRECTORY_SEPARATOR.'config.php';

function getCategories() {
    $categories = [];
    $err = false;
    $params = [
        'username'=>USERNAME,
        'token'=>TOKEN,
        'model'=>'kupon_mozliwa_kategoria',
        'join'=>[
            'LEFT JOIN, kategoria_ho, kupon_mozliwa_kategoria.kategoria_ho_id = kategoria_ho.ho_id'
        ],
        'field'=>[
            'kupon_mozliwa_kategoria.kategoria_ho_id',
            'kategoria_ho.nazwa'
        ],
    ];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, URL_API.'?'.http_build_query($params));
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $categoriesResponse = curl_exec($ch);
    if ( curl_errno($ch) ) {
        $err = true;
    }
    curl_close($ch);
    $categoriesResponse = json_decode($categoriesResponse, true);
    if ( !$err AND $categoriesResponse['status'] == 200 ) {
        foreach ( $categoriesResponse['data'] as $kat ) {            
            $categories[$kat['kategoria_ho_id']] = $kat['nazwa'];
        }
    }
    return $categories;
}

function getCouponsFromCategory($categoryId, $limit = 8) {
    $coupons = [];
    $err = false;
    $params = [
        'username'=>USERNAME,
        'token'=>TOKEN,
        'model'=>'kupon',
        'filter'=>[
            'kupon.status'=>1,
            '>=|kupon.wazny_do'=>date('Y-m-d H:i:s'),
            'kupon.widocznosc'=>1,
            'kupon.kategoria_ho_id'=>$categoryId
        ],
        'field'=>[
            'kupon.id',
            'kupon.nazwa',
            'kupon.link_wygenerowany',
            'oferta.thumbnail_preview_uri',
            'oferta.name',
            'kupon.typ',
            'kupon.tresc_kodu_rabatowego',
            'kupon.kategoria_ho_id',
            'kupon_oferta_priorytet.priorytet'
        ],
        'join'=>[
            'LEFT JOIN, oferta, kupon.oferta_id = oferta.oferta_id',
            'LEFT JOIN, kupon_oferta_priorytet, kupon.oferta_id = kupon_oferta_priorytet.oferta_id'
        ],
        'limit'=>$limit,
        'sort'=>['kupon_oferta_priorytet.priorytet'=>'DESC', 'kupon.id'=>'DESC']
    ];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, URL_API.'?'.http_build_query($params));
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $couponsResponse = curl_exec($ch);
    if ( curl_errno($ch) ) {
        $err = true;
    }
    curl_close($ch);
    $couponsResponse = json_decode($couponsResponse, true);
    if ( !$err AND $couponsResponse['status'] == 200 ) {
        foreach ( $couponsResponse['data'] as $coupon ) {
            $coupons[] = $coupon;
        }
    }
    return $coupons;
}

function saveToFile($path, $string = '', $mode = 'w') {
    if ( $fp = fopen($path, $mode) ) {
        fwrite($fp, $string);
        fclose($fp);
    }
}

function createFileCache() {
    $dateNow = date('Y-m-d H:i:s');
    if ( $dateFromFile = fgets(fopen(CACHEFILEPATH, 'r')) ) {
        $dateFromFileH = new \DateTime($dateFromFile);
        $dateFromFileH = $dateFromFileH->modify('+4 hours')->format('Y-m-d H:i:s');
        if ( $dateNow >= $dateFromFileH ) {
            return true;
        }
        return false;
    }
    return true;
}

function init() {    
    if ( createFileCache() ) {        
        $categories = getCategories();
        $categoriesIds = array_keys($categories);
        if ( !empty($categoriesIds) ) {
            $couponsArr = [];
            saveToFile(CACHEFILEPATH, date('Y-m-d H:i:s').PHP_EOL);
            foreach ( $categoriesIds as $catId ) {
                $coupons = getCouponsFromCategory($catId);
                if ( !empty($coupons) ) {
                    $couponsArr[$categories[$catId]] = $coupons;
                    foreach ($couponsArr[$categories[$catId]] as $key => $value) {
                        $couponsArr[$categories[$catId]][$key]['link_wygenerowany'] = str_replace('{affiliate_id}', '16185', $value['link_wygenerowany']);
                    }
                }        
            }
            saveToFile(JSONFILEPATH, json_encode($couponsArr, JSON_PRETTY_PRINT).PHP_EOL, 'w');
        }
    }
}

function getCouponsFromFile() {
    $coupons = [];
    if ( $file = fopen(JSONFILEPATH, 'r') ) {
        while ( !feof($file) ) {
            $line = fgets($file);
            $result = json_decode($line, true);
            $cat = key($result);
            if (strlen($cat) > 1 ) {
                $coupons[$cat] = $result[$cat];
            }
        }
        fclose($file);
    }
    return $coupons;
}

init();
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Motyla Noga- Link Nieaktywny</title>
    <link rel="stylesheet" type="text/css" href="assets/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="assets/style.css">
    <script type="text/javascript" src="assets/jquery-3.2.1.min.js"></script>
    <script src="assets/app.js" type="text/javascript"></script>
    <meta name="description" content="Link nieaktywny. Zapraszamy do zapoznania się z innymi promocjami.">
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MH8TPVM');</script>
    <!-- End Google Tag Manager -->
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MH8TPVM"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <!-- FIRST SCREEN -->
    <div id="main-screen">
        <header>
            <img id="bg">
        </header> 
        <div id="main-screen-content">
            <div class="container">
                <div class="offers">

                </div>
            </div>
        </div>
    </div>
    <!--SECOND SCREEN -->
    <div id='coupon-screen'>

    </div>
    <!--THIRD SCREEN -->
    <div id="categories-screen">
        <div class="categories-menu">
            <div class="container"></div>
        </div>
        <div class="container">
            <div class="offers"></div>
        </div>
    </div>
</body>
</html>
