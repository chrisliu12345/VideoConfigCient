function arrow() {
    var svg5 = d3.select("#test2svg");
    if ($("#arrow1").length === 0) {
        var svg51 = svg5.append("line").attr("id", "arrow1");
    } else {
        d3.select("#arrow1").remove();
        svg51 = svg5.append("line").attr("id", "arrow1");
    }

    var ifDrag5=0;
    svg5.on("mousedown",function () {

        if (ifDrag5 === 0){
            svg51.attr("x1", d3.event.offsetX).attr("y1", d3.event.offsetY)
                .attr("style", "stroke:rgb(204,58,58);stroke-width:2")
        }
    });
    svg5.on("mousemove",function () {

        if (ifDrag5 === 0) {
            d3.select("#arrow1").attr("x2", d3.event.offsetX).attr("y2", d3.event.offsetY).attr("marker-end","url(#markerArrow)")
        }
    });
    svg5.on("mouseup",function () {
        ifDrag5=1;
        var arrx1=((d3.select("#arrow1").attr("x1"))/560).toFixed(4);
        var arry1=((d3.select("#arrow1").attr("y1"))/450).toFixed(4);
        var arrx2=((d3.select("#arrow1").attr("x2"))/560).toFixed(4);
        var arry2=((d3.select("#arrow1").attr("y2"))/450).toFixed(4);
        console.log(arrx1,arry1,arrx2,arry2);
        $("#arrow0").attr("value", arrx1+","+arry1);
        $("#arrow2").attr("value", arrx2+","+arry2);
    });
}