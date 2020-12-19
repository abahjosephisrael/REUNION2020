$(function() {
    /* global variables */
    const button = $(".create-dp");
    const fileInput = $("input[type=file]");
    const preview = $("img");
    const changebtn = $(".change");
    const deletebtn = $(".delete");
    const fileInpbtn = $(".fileinput-button");
    const main = $("main");
    const mainContent = main.innerHTML;

    $(".image-editor").cropit();

    $("form").submit(function(e) {
        e.preventDefault();
        var username = $("#fullname").val();
        // Move cropped image data to hidden input
        var imageData = $(".image-editor").cropit("export", {
            type: "image/jpeg",
            quality: 1.0,
            originalSize: true
        });
        $(".hidden-image-data").val(imageData);

        $(".create-dp")
            .attr("disabled", "disabled")
            .html("...processing");

        // x, y, width, height
        const picData = [490, 99, 320, 320];
        // name, y
        const nameData = [username, 500];

        createDP(username, imageData, picData, nameData, function(url) {
            navigateTo("yourdp", createHTMLForImage(url));

            function createHTMLForImage(url) {
                return `
        <section class="dp-container">
          <a href="?" class="arrow-back"><i class="ti-arrow-left"></i></a>
          <div>
          <img id="dp_result" src=${url} title="Your DP"/>
          <br>
          <center class="center-form"><b>
          Click the below copy button to copy and paste this text along with your generated Image on Social Platform<br>
          </b><textarea id="inputco" style="margin: 0px; width: 350px; height: 70px;">I am attending GSSOSA 2014 SET REUNION 2020. #GSSOSA2014 #REUNION2020. Do not wait to be told the story. - Use https://gsso-reunion.netlify.app to Generate Your own I will there Image</textarea> 
          <br>
          <button id="copy-button">Copy Text</button> </center>
          <br>
          <a class="download-dp" href="${url}" download="REUNION2020_DP_${username}">Download Image</a>

          <script>
          var inputco = document.getElementById("inputco");
          var button = document.getElementById("copy-button");
       
           button.addEventListener("click", function(event) {
               event.preventDefault;
               inputco.select();
               document.execCommand("copy");
           });
          </script>
        <section> <br>
      `;
            }
        });
    });

    /* file input */
    fileInput.on("change", function(e) {
        fileInpbtn.css({ display: "none" });
        changebtn.css({ display: "inline-block" });
        deletebtn.css({ display: "inline-block" });
    });

    /* change image btn */
    changebtn.on("click", function() {
        fileInput.click();
    });

    /* remove image btn */
    deletebtn.on("click", function() {
        let file = document.querySelector("input[type=file]").files[0];
        file.value = null;

        fileInpbtn.css({ display: "inline-block" });
        changebtn.css({ display: "none" });
        deletebtn.css({ display: "none" });

        $(".cropit-preview-image").attr("src", "");
    });

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || "";
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    function createDP(username, imageUrl, pic, name, cb) {
        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            imageCount = 2,
            view = {
                x: pic[0],
                y: pic[1],
                width: pic[2],
                height: pic[3]
            },
            innerText = {
                x: 540,
                y: 322
            };

        var userImg = loadImage(imageUrl);
        var frameImg = loadImage("src/img/frame.jpg");

        function loadImage(src) {
            var img = new Image();
            img.onload = transformImage;
            img.src = src;
            return img;
        }

        function transformImage() {
            if (--imageCount !== 0) return;

            canvas.width = frameImg.width;
            canvas.height = frameImg.height;

            ctx.drawImage(frameImg, 0, 0);

            ctx.drawImage(userImg, view.x, view.y, view.width, view.height);

            //ctx.textBaseline = "bottom";e
            //ctx.font = "bold 30px Arial";eeeee
            //ctx.fillStyle = "#fff";e
            //ctx.fillText("#TalkNow", 750, view.y + innerText.y);

            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.font = "bold 40px Raleway";
            ctx.fillStyle = "#black";
            ctx.fillText(name[0], 460, name[1]);

            cb(canvas.toDataURL("image/jpeg", 1.0));
        }
    }

   $("button").click(function(){
       $("textarea").select();
       document.execCommand('copy')
   });

    function navigateTo(view, temp = "") {
        switch (view) {
            case "yourdp":
                main.html(temp);
                main.css({ background: "none" });
                break;
            default:
                main.style.background = "rgb(108, 86, 123)";
                main.innerHTML = mainContent;
        }
    }
    console.log("DOM fully loaded and parsed");
});