
# GET /org/orgs

# POST /org/addOrg

- orgID
- name
- description
- password
- expiry
- maxUsers

# DELETE /org/removeOrg

- orgID
- password

# PUT /org/updateSubscription

- orgID
- password
- expiry
- addDays
- maxUsers