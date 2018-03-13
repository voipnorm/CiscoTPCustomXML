# Telepresence Deploy XML APP

Simple app to deploy packages to Cisco Telepresence apps.

Currently capable of deploying custom Branding with little fuss. Takes care of reading CSV files for endpoints and also base64 encoding of image files.


## Getting Started

The following applications and hardware are required:


* Cisco Video endpoint
* Nodejs
* CSV file with IP addresses for endpoints placed in the Endpoint directory
* Image files to be deployed placed in branding and wallpaper directories
    * Branding image 272x272 preferred
    * Background Image 1920x1080 preferred
### Prerequisites

Configuration required:

* Video endpoint 


### Installing

#### Via Git
```bash
mkdir myproj
cd myproj

```

Set the following environment variables in a .env file...

```
TPADMIN=<admin Username>
TPADMINPWD=<your password>

```
## Built With

* Nodejs

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Me

