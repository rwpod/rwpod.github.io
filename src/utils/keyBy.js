const keyBy = (collection, key) => (
  collection.reduce((agg, item) => ({
    ...agg,
    [item[key]]: item
  }), {})
)

export default keyBy
