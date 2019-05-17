// 0000000000000000000000000 All Define Variable in Javascript 0000000000000000000000000000000000000000000000000//

  var image; // Deklarasi var image untuk menyimpan image dari input
  var originalImage = null; // tempat menampung image original
  var valueBrightnessBefore = 0; // Variable menampung nilai brightness sebelumnya
  var totalRed = new Array(256).fill(0); // untuk menampuang banyaknya pixel warna merah dalam bentuk array 0 -255
  var totalGreen = new Array(256).fill(0); // untuk menampuang banyaknya pixel warna hijau dalam bentuk array 0 -255
  var totalBlue = new Array(256).fill(0); // untuk menampuang banyaknya pixel warna biru dalam bentuk array 0 -255
  var dps = []; // untukk menyimpan data array hijau/merah/biru yang akan digunakan pada histogram
  var Sk = []; // Deklarasi Array untuk menampung nilai ubah untuk Histogram Equalization

//------------------------------------- All Jquery Trigger Function -------------------------------------------- //

  $('#finput').on('change', function(){
    upload();
  });

  $('#brightness').on('input',function(){ // Jika inputan brightness digeser, maka akan melakukan aksi didalamnya yaitu ...
      var value = $(this).val(); // mengambil nilai brightness
      makeBrightness(value, valueBrightnessBefore, originalImage); // memanggil fungsi yang merubah brightness gambar
      valueBrightnessBefore = value; // menyimpan nilai brightness yang sekarang
  });

  $('#normalImage').on('click',function(){
    alert('ada');
    normalImage();
  });

  $('#showHistogram').on('click', function(){ // jika show histogram di klik maka akan..
    showHistogram(); // memanggil fungsi show histogram
  });

  $('#HistogramEqualization').on('click', function(){
    HistogramEqualization();
  });


 // ====================  All Function Javascript for Image Processing ============================================= //

  function upload() {
    //Get input from file input
    var fileinput = document.getElementById("finput");

    //Make new SimpleImage from file input
    image = new SimpleImage(fileinput);

    //Get canvas
    var canvas = document.getElementById("can");

    //Draw image on canvas
    image.drawTo(canvas);
  }


  // Function untuk merubah gambar jadi grayscale
  function makeGray() {
    //loopoing untuk merubah pixel menjadi gray
    for (var pixel of image.values()) {
      var avg = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3; // rumus grayscale
      pixel.setRed(avg);
      pixel.setGreen(avg);
      pixel.setBlue(avg);
    }

    //Menampilkan gambar baru
    var canvas = document.getElementById("can");
    image.drawTo(canvas);
  }


  //fungsi untuk merubah brightness gambar
  function makeBrightness(value, valueBrightnessBefore, originalImage){
    let brightnessBefore = 255 * ((valueBrightnessBefore / 100)); // rumus nilai brightness sebelumnya
    let brightness = (255 * ((value) / 100)) - brightnessBefore; // rumus nilai brightness sekarang dikurang yang sebelumnya, sehingga tidak terjadi pemutihan/penghitaman gambar
    image = originalImage;
    //looping untuk merubah brightness gambar
    for (let pixel of image.values()) {
      pixel.setRed(pixel.getRed() +  brightness );
      pixel.setGreen(pixel.getGreen() + brightness );
      pixel.setBlue(pixel.getBlue() + brightness );
    }

    //Menampilkan gambar baru
    let canvas = document.getElementById("can");
    image.drawTo(canvas);
  }


  //fungsi untuk menampilkan histogram dan mengambil nilai setiap masing warna
  function showHistogram(){
    // Walaupun diatas sudah di deklarasi, disini array di set 0 lagi, karena update data histogram
    totalRed = new Array(256).fill(0); // untuk menampuang banyaknya pixel warna merah dalam bentuk array 0 -255
    totalGreen = new Array(256).fill(0); // untuk menampuang banyaknya pixel warna hijau dalam bentuk array 0 -255
    totalBlue = new Array(256).fill(0);

    //looping setiap pixel, dan nilai nilai ditaruh di dalam array warna, untuk mengatahui jumlah warnanya
    for (let pixel of image.values()) {
      totalRed[pixel.getRed()]++ ;
      totalGreen[pixel.getGreen()]++ ;
      totalBlue[pixel.getBlue()]++ ;
    }

    //mendekrarasikan chart menggunakan library canvasjs
    let chart = new CanvasJS.Chart("chartContainer",{
      title :{
        text: "Histogram Gambar"
      },
      axisX: {
        title: "Total Bit"
      },
      axisY: {
        title: "Units"
      },
      data: []
     });

     //fungsi untuk memasukkan array ke dalam chartnya
     function parseDataPoints (datapixel) {
         for (let i = 0; i <= datapixel.length; i++)
         dps.push({y: datapixel[i]});
     };

     // looping penyimpanan data dalam 1 chart
     for(let i = 0; i<3; i++){
       dps = [];
       if(i == 0){
         var datapixel = totalBlue;
       }else if(i == 1){
         var datapixel = totalRed;
       }else{
         var datapixel = totalGreen;
       }
       parseDataPoints(datapixel);
       chart.options.data.push({
          type: "line",
          dataPoints: dps
       });
        chart.render();
     }
 }


  function normalImage(){
    image = originalImage;
    image.drawTo(canvas);
  }

  function HistogramEqualization(){
    let DistribusiKumulatif = 0;
    // Mencari nilai Sk nya
    for(let i = 0; i < 255; i++){
       DistribusiKumulatif +=  totalRed[i]; // bisa red atau green atau blue soalnya sama aja
       Sk[i] = Math.round((DistribusiKumulatif * (getTingkatKeabuan()))/(image.values().length))
    }

    console.log(DistribusiKumulatif);

    //Mengganti setiap pixel
    for (let pixel of image.values()) {
      let a = 0;
      while( a < 255 ){
        if(pixel.getRed() == a){
          pixel.setRed(Sk[a]);
          pixel.setGreen(Sk[a]);
          pixel.setBlue(Sk[a]);
          break;
        }
        a++;
      }
    }

    //Menampilkan gambar baru
    let canvas = document.getElementById("can");
    image.drawTo(canvas);
  }


  // Untuk mengambil tingkat keabuan dari 0 - 255 yang digunakan untuk Hist
  function getTingkatKeabuan(){
    for(let i = 254; i > -1; i--){
      if(totalRed[i] != 0){
        return i;
      }
    }
  }


  // Fungsi untuk mengambil mean histogram
  function mean(datahistogram){
    let sum = 0; // Sum
    console.log(datahistogram);
    for (var i = 0; i <= datahistogram.length; i++){
      sum += datahistogram[i];
    }
    let average = sum / datahistogram.length;
    return sum/datahistogram.length;
  }
