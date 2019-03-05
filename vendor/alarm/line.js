//画单线
function lines(){

    var svg2=d3.select("#test1svg");
    console.log($("#line1").length);
    if($("#line1").length===0){
        var svg22= svg2.append("line").attr("id", "line1");
    }else {
        d3.select("#line1").remove();
        svg22= svg2.append("line").attr("id", "line1");
    }

    var ifDrag1=0;
    console.log(ifDrag1);
    svg2.on("mousedown",function () {

        if (ifDrag1 === 0){
            svg22.attr("x1", d3.event.offsetX).attr("y1", d3.event.offsetY)
                .attr("style", "stroke:rgb(204,58,58);stroke-width:2")
    }
    });
    svg2.on("mousemove",function () {

        if (ifDrag1 === 0) {
            d3.select("#line1").attr("x2", d3.event.offsetX).attr("y2", d3.event.offsetY)

        }
    });
    svg2.on("mouseup",function () {
            ifDrag1=1;
            var linx1=((d3.select("#line1").attr("x1"))/560).toFixed(4);
            var liny1=((d3.select("#line1").attr("y1"))/450).toFixed(4);
            var linx2=((d3.select("#line1").attr("x2"))/560).toFixed(4);
            var liny2=((d3.select("#line1").attr("y2"))/450).toFixed(4);
        $("#simpline0").attr("value", linx1+","+liny1);
        $("#simpline1").attr("value", linx2+","+liny2);

    });

}