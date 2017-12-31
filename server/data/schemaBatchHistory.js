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
    productId : Int
    name : String
  }

  type batchHistoryInfo{
    lottoId : String
    quantita : Int
  }
  
  extend type Query {
    batchHistory: [BatchHistory]
  }
`;
 
export default BatchHistoryInfo