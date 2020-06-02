//needs testing against data

import gql from 'graphql-tag';

const researchById = gql`
  query User_research($id: ID!) {
    researchbyid(id: $id) {
      id
      url
      projectId
      created_at
    }
  }
`;

export default researchById;
