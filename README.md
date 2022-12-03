# ChowNow Case study component



### Development Workflow
When building components for production environments I spend time up front reviewing requirements, considering user experience/layout and looking into which stock salesforce components/features I can utilize. I’ll then compose a rough design using whatever I can from Salesforce’s lwc component library and figure out what gaps need to be filled in to achieve the requirements. Next I would build the basic component markup and populate the page with moc data in my controller. Once all this is in place I’d create my apex controller for fetching real data. After connecting the Apex controller and setting up error handling I would work on conditionally rendering the correct content at the right stages of the component flow. At each step throughout this process I would commit my code locally, once the component is complete I’d squash these commits prior to submitting a pull request. 

### Testing
For production components (where more time is allocated) I would use Jest tests to confirm that my front end components are operating as expected. Usually when writing Apex controllers I do my best to follow TDD, testing as I write my controller. 

### Security Considerations

When giving access to external partners it’s important to follow the least access principle. First, external partners should have their own profile defining what records they can see/edit with minimum access. Next I would ensure that all SOQL queries in the controller use the WITH SECURITY syntax. Lastly, to prevent SOQL injection attacks, any soql query that needs to include use input data should be cleansed before being run in the apex controller. I’d build SOQL queries as strings and interpolate any user input search parameters. 
