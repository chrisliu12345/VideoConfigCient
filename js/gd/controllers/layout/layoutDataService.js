
app.service('layoutDataService' , function ( $http ){
    
    this.getFinalData = function(data,self){
        var margin = {
            top: 2,
            right: 2,
            bottom: 2,
            left: 2
        },
        width = 568 - margin.left - margin.right,
        height = 568*0.618 - margin.top - margin.bottom;

        data.name=self.layoutName;
        data.width=16;
        data.height=16;
        data.windowcount=0;
        data.details=[];
        
        data.sequence = self.sequence;
        data.type = self.layoutType;
        //1快捷 2自定义
        if(data.type==1||data.type=="1"){
            data.disflag = self.disflag;
            data.width=self.horizontal;
            data.height=self.vertical;
        }else{
            data.disflag = 0;
            d3.selectAll(".selection")
            .each(function(d,i){

                var temp={};
                temp.vertexx=Math.round(d3.select(this).attr("x")/(width/16));
                temp.vertexy=Math.round(d3.select(this).attr("y")/(height/16));
                temp.width=Math.round(d3.select(this).attr("width")/(width/16));
                temp.height=Math.round(d3.select(this).attr("height")/(height/16));
                if(temp.width!=0&&temp.height!=0){
                    data.details.push(temp);
                    data.windowcount++;
                }
            });
        }
        

        return data;
    }
    this.initEdit = function(data,self){
        var margin = {
            top: 2,
            right: 2,
            bottom: 2,
            left: 2
        },
        width = 568 - margin.left - margin.right,
        height = 568*0.618 - margin.top - margin.bottom;

        //显示其它页面
        self.sequence = data.sequence;
        self.layoutType = data.type;
        self.disflag=data.disflag;
        if(data.type == '1'||data.type == 1) {
            $('#quickLayout').show(); 
            $('#editChart').hide(); 
            self.horizontal=data.width;
            self.vertical=data.height;
        } else {
            $('#editChart').show(); 
            $('#quickLayout').hide();

        }
        
        // console.log($(".modal-body").width());
        var x = d3.scaleTime()
            .domain([new Date(2013, 7, 1), new Date(2013, 7, 17) - 1])
            .rangeRound([0, width]);
        var y = d3.scaleTime()
            .domain([new Date(2013, 7, 1), new Date(2013, 7, 17) - 1])
            .rangeRound([0, height]);

        var svg = d3.select("#editChart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("rect")
          .attr("class", "grid-background")
          .attr("width", width)
          .attr("height", height);
        // gridlines in x axis function
        function make_x_gridlines() {   
            return d3.axisBottom(x)
                .ticks(16)
        }
        // gridlines in y axis function
        function make_y_gridlines() {   
            return d3.axisLeft(y)
                .ticks(16)
        }
        // add the X gridlines
        svg.append("g")     
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )

        // add the Y gridlines
        svg.append("g")     
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )

        // We initially generate a SVG group to keep our brushes' DOM elements in:
        var gBrushes = svg.append('g')
          .attr("class", "brushes");

        // We also keep the actual d3-brush functions and their IDs in a list:
        var brushes = [];

        /* CREATE NEW BRUSH
         *
         * This creates a new brush. A brush is both a function (in our array) and a set of predefined DOM elements
         * Brushes also have selections. While the selection are empty (i.e. a suer hasn't yet dragged)
         * the brushes are invisible. We will add an initial brush when this viz starts. (see end of file)
         * Now imagine the user clicked, moved the mouse, and let go. They just gave a selection to the initial brush.
         * We now want to create a new brush.
         * However, imagine the user had simply dragged an existing brush--in that case we would not want to create a new one.
         * We will use the selection of a brush in brushend() to differentiate these cases.
         */
        function newBrush() {
          var brush = d3.brush()
            .on("start", brushstart)
            .on("brush", brushed)
            .on("end", brushend);

          brushes.push({id: brushes.length, brush: brush});

          
        }
        function brushstart() {
            // your stuff here
          };

          function brushed() {
            // your stuff here
          }

          function brushend() {

            // Figure out if our latest brush has a selection
            var lastBrushID = brushes[brushes.length - 1].id;
            var lastBrush = document.getElementById('brush-' + lastBrushID);
            var selection = d3.brushSelection(lastBrush);
            // console.log(d3.event);
            // If it does, that means we need another one
            if (selection && selection[0] !== selection[1]) {
              newBrush();
            }

            // Always draw brushes
            drawBrushes();


            if (!d3.event.sourceEvent) return; // Only transition after input.
            if (!d3.event.selection) return; // Ignore empty selections.
            var xx = [d3.event.selection[0][0],d3.event.selection[1][0]].map(x.invert),
                

                yy = [d3.event.selection[0][1],d3.event.selection[1][1]].map(y.invert),

                xDate = xx.map(d3.timeDay.round),
                yDate = yy.map(d3.timeDay.round);    

            // If empty when rounded, use floor & ceil instead.
            if (xDate[0] >= xDate[1]) {
              xDate[0] = d3.timeDay.floor(xDate[0]);
              xDate[1] = d3.timeDay.offset(xDate[1]);
            }
            if (yDate[0] >= yDate[1]) {
              yDate[0] = d3.timeDay.floor(yDate[0]);
              yDate[1] = d3.timeDay.offset(yDate[1]);
            }
            // d3.select(this).transition().call(d3.event.target.move, dy1.map(y));
            d3.select(this).transition().call(d3.event.target.move, [[x(xDate[0]),y(yDate[0])],[x(xDate[1]),y(yDate[1])]]);
            // console.log( [[x(xDate[0]),y(yDate[0])],[x(xDate[1]),y(yDate[1])]]);
            console.log(this);
          }

        function drawBrushes() {

            var brushSelection = gBrushes
                .selectAll('.brush')
                .data(brushes, function (d){return d.id});

            // Set up new brushes
            brushSelection.enter()
                .insert("g", '.brush')
                .attr('class', 'brush')
                .attr('id', function(brush){ return "brush-" + brush.id; })
                .each(function(brushObject) {
                  //call the brush
                  brushObject.brush(d3.select(this));
                });

            /* REMOVE POINTER EVENTS ON BRUSH OVERLAYS
             *
             * This part is abbit tricky and requires knowledge of how brushes are implemented.
             * They register pointer events on a .overlay rectangle within them.
             * For existing brushes, make sure we disable their pointer events on their overlay.
             * This frees the overlay for the most current (as of yet with an empty selection) brush to listen for click and drag events
             * The moving and resizing is done with other parts of the brush, so that will still work.
             */
            brushSelection
                .each(function (brushObject){
                  d3.select(this)
                    .attr('class', 'brush')
                    .selectAll('.overlay')
                    .style('pointer-events', function() {
                      var brush = brushObject.brush;
                      if (brushObject.id === brushes.length-1 && brush !== undefined) {
                        return 'all';
                      } else {
                        return 'none';
                      }
                    });
                })

            brushSelection.exit()
                .remove();
          
        }

        var newBrushByData = function(data){

            var brush = d3.brush()
                .on("start", brushstart)
                .on("brush", brushed)
                .on("end", brushend);
            for(var i=0;i<data.length;i++){
                
                brushes.push({id: brushes.length, brush: brush});
            }    
            
            data.forEach(function(d,i){
                drawBrushes();
                // d=d.brush
                // console.log(d);
                d3.select("#brush-"+i).call(brush.move,
                    [
                        [x(new Date(2013,7,1+d.vertexx)), y(new Date(2013,7,1+d.vertexy))], 
                        [x(new Date(2013,7,1+d.vertexx+d.width)), y(new Date(2013,7,1+d.vertexy+d.height))]]
                    );
                console.log(d3.select("#brush-"+i));
            });
            

            
        }
        

        newBrushByData(data.details);
        
        newBrush();
        drawBrushes();
    }
    this.initView =function(data,self){
        self.layoutType=data.type;
        //选择显示什么类型的页面1快速2 自定义
        if(data.type == '1'||data.type == 1) {
            $('#quickLayout').show(); 
            $('#viewChart').hide(); 
            self.horizontal=data.width;
            self.vertical=data.height;
        } else {
            $('#viewChart').show(); 
            $('#quickLayout').hide(); 
            var margin = {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            },

            width = 568 - margin.left - margin.right,
            height = 568*0.618 - margin.top - margin.bottom;

            var x = d3.scaleTime()
                .domain([new Date(2013, 7, 1), new Date(2013, 7, 17) - 1])
                .rangeRound([0, width]);
            var y = d3.scaleTime()
                .domain([new Date(2013, 7, 1), new Date(2013, 7, 17) - 1])
                .rangeRound([0, height]);

            var svg = d3.select("#viewChart").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("rect")
              .attr("class", "grid-background")
              .attr("width", width)
              .attr("height", height);
            // gridlines in x axis function
            function make_x_gridlines() {   
                return d3.axisBottom(x)
                    .ticks(16)
            }
            // gridlines in y axis function
            function make_y_gridlines() {   
                return d3.axisLeft(y)
                    .ticks(16)
            }
            // add the X gridlines
            svg.append("g")     
                .attr("class", "grid")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_gridlines()
                    .tickSize(-height)
                    .tickFormat("")
                )

            // add the Y gridlines
            svg.append("g")     
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat("")
                )

            d3.select("#viewChart").select("svg")
                .append("g")
                .selectAll("rect")
                .data(data.details)
                .enter()
                .append("rect")
                .attr("x",function(d){
                    // console.log(x(new Date(2013,7,1+d.vertexx)));
                    return x(new Date(2013,7,1+d.vertexx));
                })
                .attr("y",function(d){
                    return y(new Date(2013,7,1+d.vertexy));
                })
                .attr("width",function(d){
                    // console.log(x(new Date(2013,7,1+d.width)));
                    return x(new Date(2013,7,1+d.width+d.vertexx))-x(new Date(2013,7,1+d.vertexx));
                })
                .attr("height",function(d){
                    return y(new Date(2013,7,1+d.height+d.vertexy))-y(new Date(2013,7,1+d.vertexy));
                })    
                .attr('class', 'brush')
                .attr( "stroke","#000")
                .attr("fill-opacity",0.3)
                .attr("fill","red")
                .attr("transform","translate(10,10)");
        } 
        //显示其它页面
        self.disflag = data.disflag;
        self.sequence = data.sequence;

        
    }
    this.getLayoutData = function(dom){
        var data={};
        data.name=dom.layoutName;
        data.width=16;
        data.height=16;
        data.windowcount=0;
        
        data.details=[];
        //快捷配置
        if(dom.layoutType==1||dom.layoutType=="1"){
            data.type=1;
            data.disflag = dom.disflag;
            data.sequence = dom.sequence;
            data.width = dom.horizontal;
            data.height = dom.vertical;
            // for(var i=0;i<dom.horizontal;i++){
            //     for(var j=0;j<dom.vertical;j++){

            //     }
            // }
        }
        //自定义配置
        else if(dom.layoutType==2||dom.layoutType=="2"){
            data.type=2;
            data.disflag=0;
            data.sequence = dom.sequence;
            d3.selectAll(".selection")
                .each(function(d,i){

                    var temp={};
                    console.log(d3.select(this).attr("y"));

                    console.log(d3.select(this).attr("y")/(height/16));
                    temp.vertexx=Math.round(d3.select(this).attr("x")/(width/16));
                    temp.vertexy=Math.round(d3.select(this).attr("y")/(height/16));
                    temp.width=Math.round(d3.select(this).attr("width")/(width/16));
                    temp.height=Math.round(d3.select(this).attr("height")/(height/16));
                    if(i!=0){
                        data.details.push(temp);
                        data.windowcount++;
                    }
                });
        }

        return data;
    }
    this.addLayout=function (data,successCall) {

        $http({
            url: '/ma/tblwindowsmode/add',
            method: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: {
                "name":data.name,
                "width": data.width,
                "height": data.height,
                "type": data.type,
                "disflag": data.disflag,
                "sequence": data.sequence,
                "windowcount": data.windowcount,
                "details":data.details
            }
        }).success(function (da) {
            console.log("add success");
            successCall();
            // $scope.searchYzw();
            // $modalInstance.dismiss('cancel');
            
        });

    };
    this.editLayout=function (data,successCall) {

        $http({
            url: '/ma/tblwindowsmode/mod',
            method: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: {
                "id":data.id,
                "name":data.name,
                "width": data.width,
                "height": data.height,
                "windowcount": data.windowcount,
                "details":data.details,
                "status": data.status,
                "type": data.type,
                "disflag": data.disflag,
                "sequence": data.sequence
            }
        }).success(function (da) {
            console.log("edit success");
            successCall();
            // $scope.searchYzw();
            // $modalInstance.dismiss('cancel');
            
        });

    };
    this.deleteLayout=function(id,successCall){
        $http({
            url: 'ma/tblwindowsmode/delete',
            method: 'GET',
            params: {
                id:id
            }
        }).success(function (da) {
            console.log("del success");
            successCall();
            // $scope.searchYzw();
            // $modalInstance.dismiss('cancel');
            
        });
    }
    this.setLayout=function(id,status,successCall){
        console.log(status);
        if(status=='0'||status==0){
            status=1;
        }else if(status=='1'||status==1){
            status=0;
        }
        $http({
            url: 'ma/tblwindowsmode/status/'+id+"/"+status,
            method: 'GET',
            params: {
                // status:status
            }
        }).success(function (da) {
            console.log("set success");
            successCall();
            // $scope.searchYzw();
            // $modalInstance.dismiss('cancel');
            
        });
    }
});