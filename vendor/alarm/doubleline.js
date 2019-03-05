//画双线
function doublelines(){

    var svg3=d3.select("#test3svg");
    if($("#line21").length===0){
        var svg31=svg3.append("line").attr("id", "line21");
    }else {
        d3.select("#line21").remove();
        svg31= svg3.append("line").attr("id", "line21");
    }
    if($("#line22").length===0){
        var svg32=svg3.append("line").attr("id", "line22");
    }else {
        d3.select("#line22").remove();
        svg32= svg3.append("line").attr("id", "line22");
    }

   
    var ifDrag3=0;
    svg3.on("mousedown",function () {
        if(ifDrag3===0) {
            svg31.attr("x1", d3.event.offsetX).attr("y1", d3.event.offsetY)
                .attr("style", "stroke:rgb(204,58,58);stroke-width:2")
        }else if(ifDrag3===1){
            svg32.attr("x1", d3.event.offsetX).attr("y1", d3.event.offsetY)
                .attr("style", "stroke:rgb(204,58,58);stroke-width:2")
        }else{}
    });
    svg3.on("mousemove",function () {

        if (ifDrag3 === 0) {
            d3.select("#line21").attr("x2", d3.event.offsetX).attr("y2", d3.event.offsetY)
        }else if(ifDrag3 === 1){
            d3.select("#line22").attr("x2", d3.event.offsetX).attr("y2", d3.event.offsetY);
        }else{}
    });
    svg3.on("mouseup",function () {
        if(ifDrag3===0) {
            ifDrag3 = 1;
            var linx1=((d3.select("#line21").attr("x1"))/560).toFixed(4);
            var liny1=((d3.select("#line21").attr("y1"))/450).toFixed(4);
            var linx2=((d3.select("#line21").attr("x2"))/560).toFixed(4);
            var liny2=((d3.select("#line21").attr("y2"))/450).toFixed(4);
            $("#doubline0").attr("value", linx1+","+liny1);
            $("#doubline1").attr("value", linx2+","+liny2);
            console.log(linx1,liny1,linx2,liny2);
        }else if(ifDrag3===1){

            ifDrag3 = 2;
            var linx21=((d3.select("#line22").attr("x1"))/560).toFixed(4);
            var liny21=((d3.select("#line22").attr("y1"))/450).toFixed(4);
            var linx22=((d3.select("#line22").attr("x2"))/560).toFixed(4);
            var liny22=((d3.select("#line22").attr("y2"))/450).toFixed(4);
            $("#doubline2").attr("value", linx21+","+liny21);
            $("#doubline3").attr("value", linx22+","+liny22);
        }else{}
    });

}