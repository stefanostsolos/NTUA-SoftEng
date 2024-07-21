<p align="center">
  <img src="https://user-images.githubusercontent.com/62433719/146981166-1fd8e777-4346-4524-a9ed-80292cba6030.png?raw=true" alt="softeng's custom image"/>
  <h3 align="center"> NTUA SoftEng - Toll Interoperability </h3>

</p>


## About the Project

This project was developed by our team as part of the SoftEng course, during the 7th semester of the Electrical and Computer Engineering school of the National Technical University of Athens. The Toll Interoperability Service System aims to address the growing need for seamless toll payment across the Greek highway network. With seven different motorway operators and an expanding network of toll stations, this system facilitates the use of a single electronic card (e-pass) for all highways, enhancing user convenience and reducing wait times.

Key objectives:
- Record debts between motorway operators from vehicle crossings
- Offset debts and manage payments between operators
- Present crossing data to operators and transport authorities
- Ensure accurate and complete debt recording
- Facilitate debt offsetting on operator request
- Confirm successful payments through payment service providers

### Repository contents

This repository contains the cumulative work produced to develop this project. Specifically, the `api` directory contains a REST API specification, compliant with OpenAPI 3.0. The `backend` directory contains all the code for the backend application, while the `cli` directory contains the code for the CLI. The `frontend` directory contains all the code for the front-end application. The `database` directory contains a dump of the MySQL database. The `doc` directory contains documents related to the requirements specifications of the project, along with a Visual Paradigm file containing diagrams. The `test-api` and `test-backend` contain the Postman collection about API and Backend tests respectively. Finally, the `test-cli` contains unit and functional tests for the CLI module.

<p align="right">(<a href="#top">back to top</a>)</p>

### Interfaces

#### External System Interfaces

The software interfaces with:

1. **Operator Crossing Management Systems**: To retrieve real-time crossing data (e.g., e-card ID, vehicle details)
2. **Operator Registration Systems**: To update the software's database with new vehicles, e-cards, and toll stations
3. **Payment Service Providers**: To receive debt settlement confirmations
4. **Third-party Authentication Systems**: For user identification upon system entry

#### User Interfaces

A web application accessible via standard web browsers, providing:

For Operators:
- User authentication
- Vehicle crossing analysis
- Debt management and analysis
- Debt settlement configuration
- Traffic statistics viewing and download

For Transport Authorities:
- User authentication
- Traffic statistics viewing and download

<p align="right">(<a href="#top">back to top</a>)</p>

### Built with

The following major frameworks/libraries were used to bootstrap our project. In general, the project's code was written exclusively in JavaScript and Express.js, with HTML and CSS also being used to develop the front-end application.

## About us

This project represents the collaborative efforts of our team. The following individuals contributed their expertise and hard work to bring this to life:

- [Alexandros Kouridakis](https://github.com/alex-kouridakis)
- [Alexandros Mantzafinis](https://github.com/AlexandrosMantzafinis)
- [Symeon Porgiotis](https://github.com/el18053)
- [Stefanos Tsolos](https://github.com/stefanostsolos)
- [Vikentios Vitalis](https://github.com/VikentiosVitalis)

Our team is readily available to address any comments or questions you may have regarding this project. Please don't hesitate to connect with us—we look forward to hearing from you!

<p align="right">(<a href="#top">back to top</a>)</p>
