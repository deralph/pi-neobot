## You can define environment variables in your .env files.

### For variables that are common across your node environment, you can define them in .env file

For variable that are specific to development and production, you can define them in .env.development and .env.production files

Also please prefix your variables with REACT_APP

Once you do that you can add scripts in your package.json to specify a build for a particular NODE_ENV

"scripts": {
    "start": "react-scripts start",
    "build": "NODE_ENV=development react-scripts build",
    "build:prod": "NODE_ENV=production react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
and then you can build your APP for production locally like

npm run build:prod
and it will use the production environment variables