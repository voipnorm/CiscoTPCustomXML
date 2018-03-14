
module.exports = {
    brandingXml: function(base64){
        return new Promise(function(resolve){
            var base64Brand = base64[0];
            var base64wp = base64[1];
            var xml2 = `<Command>
					<UserInterface>
						<Branding>
							<Upload command='true'>
								<Type>HalfwakeBranding</Type>
									<body>${base64Brand}</body>
								</Upload>
							<Upload command='true'>
								<Type>Branding</Type>
									<body>${base64Brand}</body>
							</Upload>
							<Upload command='true'>
								<Type>HalfwakeBackground</Type>
									<body>${base64wp}</body>
								</Upload>
						</Branding>
					</UserInterface>
				</Command>`;

            resolve(xml2)

        })

    }
}

