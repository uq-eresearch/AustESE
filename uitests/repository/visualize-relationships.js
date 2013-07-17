{
  "type": "script",
  "seleniumVersion": "2",
  "formatVersion": 1,
  "steps": [
    {
      "type": "get",
      "url": "http://localhost/"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Log in"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Log in using username/password"
      }
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "edit-name"
      },
      "text": "demo"
    },
    {
      "type": "setElementText",
      "locator": {
        "type": "id",
        "value": "edit-pass"
      },
      "text": "demo"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "id",
        "value": "edit-submit"
      }
    },
    {
      "type": "get",
      "url": "http://localhost/repository/versions/"
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "Demo version"
      }
    },
    {
      "type": "clickElement",
      "locator": {
        "type": "link text",
        "value": "VISUALIZE"
      }
    },
    {
      "type": "waitForTextPresent",
      "text": "Created with Raphaël 2.1.0"
    },
    {
      "type": "verifyTextPresent",
      "text": "Demo version"
    },
    {
      "type": "verifyTextPresent",
      "text": "Demo artefact"
    },
    {
      "type": "verifyTextPresent",
      "text": "appears_in"
    }
  ]
}