
$(document).ready(function(){
    
    $("#testloginpassword").submit(function(event){
        event.preventDefault();
        let login = "", password = "";

        login = event.target.querySelectorAll('input')[0].value;
        password = event.target.querySelectorAll('input')[1].value;

        let data = {phone_number:login, password: password}

        $.ajax({
            url:'http://206.189.145.94/api/v1/user/sign_in/',
            type: "POST",
            data: data,
            success: function(data) {
                
                if (data.error == 'Invalid Credentials'){
                    alert("Login yoki parol xato kiritildi!!!");
                    location.reload();
                }else{
                let token = data.token;
                let director = data.role["is_director"];
                let manager = data.role["is_manager"];
                let jobAdministrator = data.role["is_accountant"];
                let cheifSpecialist = data.role["is_chief_specialist"];
                let cheifTechnologist = data.role["is_chief_technological_man"];
                
                if(director == true){
                    window.open('director_warehouse_products.html', '_self');
                    Cookies.set("director", "true");
                    Cookies.set("manager", "false");
                    Cookies.set("jobAdministrator", "false");
                    Cookies.set("cheifSpecialist", "false");
                    Cookies.set("cheifTechnologist", "false");
                    Cookies.set("directorToken", token);
                }else{
                    if (manager == true){
                        window.open('manager_warehouse_biscuits.html', '_self');
                        Cookies.set("director", "false");
                        Cookies.set("manager", "true");
                        Cookies.set("jobAdministrator", "false");
                        Cookies.set("cheifSpecialist", "false");
                        Cookies.set("cheifTechnologist", "false");
                        Cookies.set("managerToken", token);
                    }else{
                        if (jobAdministrator == true){
                            window.open('jobAdministrator_clientlist.html', '_self');
                            Cookies.set("director", "false");
                            Cookies.set("manager", "false");
                            Cookies.set("jobAdministrator", "true");
                            Cookies.set("cheifSpecialist", "false");
                            Cookies.set("cheifTechnologist", "false");
                            Cookies.set("jobAdministratorToken", token);
                        }
                        else{
                            if (cheifSpecialist == true) {
                                window.open("cheifSpecialist_control.html", '_self');
                                Cookies.set("director", "false");
                                Cookies.set("manager", "false");
                                Cookies.set("jobAdministrator", "false");
                                Cookies.set("cheifSpecialist", "true");
                                Cookies.set("cheifTechnologist", "false");
                                Cookies.set("cheifSpecialistToken", token);
                            }else {
                            if(cheifTechnologist == true){
                                window.open("cheifTechnologist_orders_list.html", '_self');
                                Cookies.set("director", "false");
                                Cookies.set("manager", "false");
                                Cookies.set("jobAdministrator", "false");
                                Cookies.set("cheifSpecialist", "false");
                                Cookies.set("cheifTechnologist", "true");
                                Cookies.set("cheifTechnologistToken", token);
                                }else{
                                    alert("Login yoki parol xato kiritildi!!!");
                                }
                            }
                        }
                    }
                }
            }
                
            },
            failure: function(err){
                alert("Internet yo'q")
            }
        })
    })  
})