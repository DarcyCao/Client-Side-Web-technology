//reference: http://www.w3schools.com/js/js_htmldom_eventlistener.asp
// http://www.w3schools.com/jsref/dom_obj_table.asp
// http://www.w3schools.com/jsref/prop_html_innerhtml.asp
function DataGrid(inputoption) {
    this.data = inputoption.data;
    this.rootElement = inputoption.rootElement;
    this.columns = inputoption.columns;
    this.pageSize = inputoption.pageSize;
    this.onRender = inputoption.onRender;
    this.page = 1;
    this.totalpage = 1;
    if (typeof (this.pageSize) !== "undefined") {
        this.totalpage = Math.ceil(this.data.length / this.pageSize);
    }
    this.sortString = inputoption.columns[0].dataName;
    this.init();
}

(function () {

    DataGrid.prototype.printtable = function(page) {
        this.destroy();
        if (typeof(this.onRender) !== 'undefined') {
            var sefl = this;
            this.onRender(sefl);
        }
        var table = document.createElement("TABLE");
        table.setAttribute("id", "myTable");
        this.rootElement.appendChild(table);
        if (this.totalpage != 1) {
            var caption = document.createElement("CAPTION");
            caption.setAttribute("id", "myCaption");
            table.appendChild(caption);
            var next = document.createElement("PRE");
            if (this.page == this.totalpage) {
                next.setAttribute("class", "disable toclick");
            } else  {
                next.setAttribute("class", "enable toclick");
            }
            next.setAttribute("id", "nextpage");
            next.innerHTML = " Next >";
            next.setAttribute("title", "Next Page");
            next.addEventListener("click", this.clickNext.bind(this), false);
            caption.appendChild(next);
            var printPage = document.createElement("PRE");
            printPage.setAttribute("id", "printpage");
            printPage.setAttribute("class", "disable");
            printPage.innerHTML = this.page.toString() + " of " + this.totalpage.toString();
            caption.appendChild(printPage);
            var previous = document.createElement("PRE");
            if (this.page == 1) {
                previous.setAttribute("class", "disable toclick");
            } else {
                previous.setAttribute("class", "enable toclick");
            }
            previous.setAttribute("id", "previouspage");
            previous.innerHTML = "< Previous ";
            previous.setAttribute("title", "Previous Page");
            previous.addEventListener("click", this.clickPrevious.bind(this), false);
            caption.appendChild(previous);
        }
        var thead = table.createTHead();
        thead.setAttribute("id", "myThead");
        table.appendChild(thead);
        var tr = document.createElement("TR");
        tr.setAttribute("id","headLine");
        thead.appendChild(tr);
        var self = this;
        this.columns.forEach(function (element) {
            var th = document.createElement("TH");
            th.setAttribute("class", "toclick");
            th.setAttribute("name", element["name"]);
            th.setAttribute("align", element["align"]);
            th.setAttribute("width", element["width"]);
            th.setAttribute("dataName", element["dataName"]);
            th.setAttribute("title", "Sorted by " + element["name"]);
            th.innerHTML = element["name"];
            th.addEventListener("click", self.clickSortHandler.bind(self), false);
            tr.appendChild(th);
        });
        var tbody = document.createElement("TBODY");
        tbody.setAttribute("id", "myTbody");
        table.appendChild(tbody);
        var start;
        var limit;
        if (typeof (this.pageSize) !== "undefined") {
            start = (page - 1) * this.pageSize;
            limit = page  * this.pageSize;
        } else {
            start = 0;
            limit = this.data.length;
        }
        if (page === this.totalpage) {
            limit = this.data.length;
        }
        for (var j = start; j < limit; j++) {
            var temptr = document.createElement("TR");
            temptr.setAttribute("id", "tempTr");
            this.columns.forEach(function (element) {
                var td = document.createElement("TD");
                var label = element["dataName"];
                if (label == self.sortString) {
                    td.setAttribute("class", "sortproperty");
                }
                td.setAttribute("width", element["width"]);
                td.setAttribute("align", element["align"]);
                td.innerHTML = self.data[j][label];
                temptr.appendChild(td);
            });
            tbody.appendChild(temptr);
        }
    };

    DataGrid.prototype.destroy = function() {
        if (typeof (this.rootElement.innerHTML) !== "undefined") {
            this.rootElement.innerHTML = " ";
        }
    };

    //http://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
    //http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
    DataGrid.prototype.sort = function (property) {
        this.data.sort(
                function (a, b) {
                    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    return result;
                }
        );
    };

    DataGrid.prototype.init = function () {
        if (typeof(this.columns) !== 'undefined') {
            this.sort(this.sortString);
            this.printtable(this.page);
        }
    };
    DataGrid.prototype.clickSortHandler  = function (event) {
        if (typeof(event.target) !== 'undefined' && this.rootElement !== 'undefined') {
            var dataname = event.target.getAttribute("dataName");
            if (dataname == this.sortString) {
                this.data.reverse();
                this.printtable(this.page);
            } else {
                this.sort(dataname);
                this.sortString = dataname;
                this.printtable(this.page);
            }
        }
    };
    DataGrid.prototype.clickPrevious = function (event) {
        if (typeof (event.target) !== 'undefined' && this.rootElement !== 'undefined') {
            var pagenumber = this.page;
            if (pagenumber > 1) {
                pagenumber = pagenumber - 1;
                this.page = pagenumber;
            }
            this.printtable(this.page);
        }
    };
    DataGrid.prototype.clickNext = function (event) {
        if (typeof (event.target) !== 'undefined' && this.rootElement !== 'undefined') {
            var pagenumber = this.page;
            if (pagenumber < this.totalpage) {
                pagenumber = pagenumber + 1;
                this.page = pagenumber;
            }
            this.printtable(this.page);
        }
    };
})();
