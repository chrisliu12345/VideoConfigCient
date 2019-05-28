//以下为画矩形
var svg1=d3.select("#test2svg")
var ifDrag=false;
svg1.on("mousedown",function () {
    svg1.select("rect").remove();
    ifDrag=true;
    svg1.append("rect").attr("id","rect1").attr("x",d3.event.offsetX).attr("y",d3.event.offsetY)
        .attr("width",0).attr("height",0)
        .attr("style","fill:white;stroke:red;stroke-width:3;fill-opacity:0.1;stroke-opacity:0.9")
});
svg1.on("mousemove",function () {
    if(ifDrag===true){
        var width=d3.event.offsetX - d3.select("#rect1").attr("x");
        var height=d3.event.offsetY - d3.select("#rect1").attr("y");
        d3.select("#rect1").attr("width",width).attr("height",height)
    }

});
svg1.on("mouseup",function () {
    ifDrag=false;
    var w1=d3.select("#rect1").attr("width");
    var h1=d3.select("#rect1").attr("height");
    var xj1=d3.select("#rect1").attr("x");
    var resultxj1=(xj1/570).toFixed(4);
    var yj1=d3.select("#rect1").attr("y");
    var resultyj1=(yj1/450).toFixed(4);
    d3.select("#startXY1").attr("value", resultxj1 + "," + resultyj1);
    d3.select("#endW1").attr("value", w1);
    d3.select("#endH1").attr("value", h1);
});