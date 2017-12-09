const BatchHistoryInfo = `
  type BatchHistory {
    date : String!,
    actions: [action]
  }

  type action {
    action: String!,
    product: productHistoryInfo,
    lotto: batchHistoryInfo,
  }

  type productHistoryInfo{
    id : Int
    name : String
  }

  type batchHistoryInfo{
    id : String
    quantita : Int
  }
  
  extend type Query {
    batchHistory: [BatchHistory]
  }
`;
 
export default BatchHistoryInfo