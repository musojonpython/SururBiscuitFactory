
    $(document).ready(function(){
        
        mycookie = Cookies.get("jobAdministrator");

        if (mycookie == "false" || mycookie == undefined){
            window.open('index.html', "_self");
        }
        let token = Cookies.get("jobAdministratorToken");

        $('#dataRightSubmenu').load('helperjobAdministrator.html div#helpersubmenu');
        $('#infoAboutCheif').load('helperjobAdministrator.html div#helperinfoCheif')

        getstaff();
        // getproducts();

        // Begin creating dynamic rows for Retsept


        $("button#addretseptrow").click(function(){
            let div, div0, input1;

            div = document.querySelector("#addretseptrowId");
            div0 = document.createElement("div");
            div0.classList.add('row');

            for (let i = 1; i <= 4; i++){
                div1 = document.createElement("div");
                div1.classList.add("col");
            
                div2 = document.createElement("div");
                div2.classList.add("form-group");    

                input1 = document.createElement("input");
                input1.setAttribute("required", "required");
                input1.setAttribute("type", "number");
                input1.classList.add("form-control");

                if (i == 1){
                    input1 = document.createElement("select")
                    input1.setAttribute("tabindex", "0");
                    input1.setAttribute("id", "staffName");
                    input1.classList.add("form-control");
                    input1.classList.add("select2_single");
                }
                if (i == 2){
                    input1 = document.createElement("select")
                    input1.setAttribute("tabindex", "0");
                    input1.setAttribute("id", "ProductName");
                    input1.classList.add("form-control");
                    input1.classList.add("select2_single");
                }
                
                div2.appendChild(input1);
                div1.appendChild(div2);
                div0.appendChild(div1);
            }

            div.appendChild(div0);
        })
        // End creating dynamic row for Retsept

        // Begin remove rows from form

        function removeretseptrow(){
            let div = document.querySelector("#addretseptrowId");
            let count = div.childElementCount;
            if (count > 1){
                div.removeChild(div.lastChild);
            }
        }

        // End remove rows from form

        // Begin Save retsept biscuit data to server

        let form2 = document.querySelector('#addretseptform')

        form2.addEventListener('submit', function(event){
            event.preventDefault();

            let idBiscuit, idProduct, weight, retseptdata=[], aaa = {};
            let count = event.target.length - 3;

            for (let i = 0; i < count; i++){
                idBiscuit = parseFloat(event.target[i].value); i++;
                idProduct = parseFloat(event.target[i].value); i++;
                weight = parseFloat(event.target[i].value);
                aaa.biscuit = idBiscuit;
                aaa.product = idProduct;
                aaa.value = weight;
                retseptdata.push(aaa);
                aaa = {};
                // console.log(idBiscuit, idProduct, weight);
            }
            console.log(retseptdata);
                fetch('http://206.189.145.94/api/v1/retsept/', {
                    method:'POST',
                        headers:{
                            'Accept':'application/json, text/plain, */*',
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify (retseptdata),
                })
                .then(res => {
                    if(!res.ok) {
                        alert("Xatolik sodir bo'ldi")
                        throw new Error("Xatolik sodir bo'ldi");
                    }else{
                        alert("Muvaffaqqiyatli saqlandi");
                        for (let i = 0; i <= count; i++){
                            event.target[i].value = "";
                        }
                
                        let div = document.querySelector("#addretseptrowId");
                        let countChild = div.childElementCount;
                        if (countChild > 1){
                            div.removeChild(div.lastChild);
                            countChild--;
                        }
                    }
                    return res.json()
                })
                .then((data)=>{
                })
                .catch((err)=>console.log(err));
            
        

        })

        // End save retsept biscuit data to server

        // Begin  get information from data for select element

        function getstaff(){
            fetch('http://206.189.145.94/api/v1/user/filter/?role=staff')
            .then((res)=>res.json())
            .then((data)=>{
                let biscuits = document.querySelectorAll("#staffName");
                let count = biscuits.length - 1;
                
                data.forEach(elem=>{
                    let element = document.createElement("option");
                    let name = elem.last_name + " " + elem.first_name;
                    element.textContent = name
                    element.setAttribute("value", elem.id);
                    biscuits[count].appendChild(element);
                })
            })
        }

        function getproducts(){
            // console.log("getproducts");
            fetch('http://206.189.145.94/api/v1/warehouse/product/')
            .then((res)=>res.json())
            .then((data)=>{
                let products = document.querySelectorAll("#ProductName");
                let globdata, element;
                globdata = data;
                count = products.length - 1;
                
                globdata.forEach(elem=>{
                        element = document.createElement("option");
                        element.textContent = elem.product.name;
                        element.setAttribute("value", elem.product.id);
                        products[count].appendChild(element);
                    })
            })
        }

        // End get information from data for select element
    
})