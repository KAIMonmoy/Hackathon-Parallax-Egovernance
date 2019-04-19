
		                    	function pageFunction(){
		       //              		const fs = require('fs');
									// // Data which will write in a file. 
									var userName,userPass;
									
 									userName = document.getElementById("inputEmail3").value;
									userPass = document.getElementById("inputPassword3").value;
    								
									console.log(userName);
									if((userName === "shahrarswapnil@gmail.com" && userPass === "1234") ||
									 (userName === "mdSunan@gmail.com" && userPass === "5678")){
										// set fso = CreateObject("Scripting.FileSystemObject"); 
    						// 			set s   = fso.CreateTextFile("info.txt", True);
    						// 			s.writeline(userName);
    						// 			s.writeline(userPass);
 									// 	s.writeline("-----------------------------");
    						// 			s.Close();
										location.replace("home.html");	
									}
									// let data = userName + " " + userPass;
  							// 		// Write data in 'Output.txt' . 
									// fs.writeFile('info.txt', data, (err) => { 
  							// 			// In case of a error throw err. 
    					// 				if (err) throw err;
									// }) 
		                   	 		
		                    	}
		                