 var LPAWS = {};
// JavaScript contact form Document
$(document).ready(function() {
	
	   
  

        // Initialize the Amazon Cognito credentials provider
        AWS.config.region = 'us-east-2'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-2:3a3c047a-d458-44b3-ab18-c7e1d80614c6',
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
					TopicArn: 'arn:aws:sns:us-east-2:856289330139:com-website-contact-form'
				};
				sns.publish(params, function(err, data) {
					if (err) console.log(err, err.stack); // an error occurred
					else     console.log(data);           // successful response
				});
        };
	};
});