function updateCatalog() {
    var myCarousel = document.getElementById("catalog_carousel");
    if (!XMLHttpRequest) return;
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/flowers", true);
    ajax.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var flowers = JSON.parse(this.responseText);
        flowers.forEach(function(flower, index) {
          var img = document.createElement("img");
          img.setAttribute("src", flower.picture);
          img.setAttribute("alt", "Image");

          var div_in = document.createElement("div");
          div_in.className = "carousel-caption";

          var h3 = document.createElement("h3");
          h3.innerText = flower.cost + " $";

          var p = document.createElement("p");
          p.innerText = flower.name;

          var div = document.createElement("div");
          if(index == 0)
          {
            div.className = "item active";
          }
          else
          {
            div.className = "item";
          }

          div_in.appendChild(h3);
          div_in.appendChild(p);
          div.appendChild(img);
          div.appendChild(div_in);
          myCarousel.appendChild(div);
        });
      };
    };
    ajax.send();
  }