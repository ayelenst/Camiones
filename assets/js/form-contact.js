 var LPAWS = {};
// JavaScript contact form Document
$(document).ready(function() {
	
	   
  

        // Initialize the Amazon Cognito credentials provider
        AWS.config.region = 'eu-west-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'eu-west-1:e4c24108-5050-42f8-ac0b-761c46aa947f',
        });

        LPAWS.sendToTopic = function() {
			$('form#contact-form .error').remove();
			hasError=false;
			$(':input[required]:visible').each(function() {
				if(jQuery.trim($(this).val()) == '') {
				var labelText = $(this).attr('name');
				$(this).parent().append('<span class="error">Te olvidaste de ingresar '+labelText+'</span>');
				$(this).addClass('inputError');
				hasError = true;
				} else if($(this).attr('type')=='email') {
					var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
					if(!emailReg.test(jQuery.trim($(this).val()))) {
						var labelText = $(this).attr('name');
						$(this).parent().append('<span class="error">Has ingesado un '+labelText+' inválido</span>');
						$(this).addClass('inputError');
						hasError = true;
					}
				}
			});
			if(!hasError) {
				$('form#contact-form input.submit').fadeOut('normal', function() {
				$(this).parent().append('');
				});
			
				var firstname = document.querySelector('#firstname').value;
				var email = document.querySelector('#email').value;
				var subject = document.querySelector('#subject').value;
				var description = document.querySelector('#description').value;
				
				
				var sns = new AWS.SNS();
				var params = {
					//Message: 'Hello topic', /* required */
					Message: description,
					Subject: 'Nuevo mail de '+firstname+' email: '  + email+ ' asunto: '+subject,
					TopicArn: 'arn:aws:sns:eu-west-1:717437904155:com-website-contact-form'
				};
				sns.publish(params, function(err, data) {
					if (err) console.log(err, err.stack); // an error occurred
					else     console.log(data);           // successful response
				});
        };
	};
});