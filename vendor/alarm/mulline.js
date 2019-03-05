function mullines() {
    var svg4 = d3.select("#test4svg");
    //var sk = svg4.append("polyline").attr("id", "polyline1");
    if($("#polyline1").length===0){
    var  sk = svg4.append("polyline").attr("id", "polyline1");
    }else {
        var sk=d3.select("#polyline1");
    }
    var ifDrag4 = 0;
    var showDrag=true;
    var xx1;
    var xx2;
    var he = "";
    var hedata="";
        svg4.on("mousedown", function () {

            if (showDrag === true) {
                ifDrag4 = ifDrag4 + 1;
                if (ifDrag4 === 1) {
                    xx1 = d3.event.offsetX;
                    xx2 = d3.event.offsetY;
                }
                he = he + d3.event.offsetX + "," + d3.event.offsetY + " ";
                var linx3=((d3.event.offsetX)/560).toFixed(4);
                var liny3=((d3.event.offsetY)/560).toFixed(4);
                hedata=hedata+linx3+","+liny3+";";
                sk.attr("points", he)
                    .attr("style", "fill:white;stroke:red;stroke-width:3;fill-opacity:0.1;stroke-opacity:0.9")
            }
        });
        svg4.on("mouseup", function () {
            console.log(d3.event);
            if (showDrag === true) {

                //判断结果点是否在起始点的指定区域，如果是则把起始点作为坐标
                if (ifDrag4 > 2) {
                    //成此时闭合区域
                    var rusultx=Math.abs(xx1 - d3.event.offsetX);
                    var resulty=Math.abs(xx2 - d3.event.offsetY );
                    if ((rusultx < 50) && (resulty < 50)) {
                        he = he + xx1 + "," + xx2 + " ";
                        var linx31=((xx1)/560).toFixed(4);
                        var liny31=((xx2)/560).toFixed(4);
                        hedata=hedata+linx31+","+liny31;
                        d3.select("#polyline1").attr("points", he);
                        showDrag = false;
                        console.log(hedata);
                        $("#mulline").attr("value", hedata);
                    }
                }
            }


        });

}