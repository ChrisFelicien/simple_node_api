class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    const queryObj = { ...this.queryStr };
    const excludesFields = ['page', 'sort', 'limit', 'fields'];
    excludesFields.forEach((filed) => delete queryObj[filed]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (m) => `$${m}`); //Replace all sign

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  selectFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.replaceAll(',', ' ');

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-createdAt, -__v');
    }
    return this;
  }

  pagination() {
    const limit = Number(this.queryStr.limit || 20);
    const page = Number(this.queryStr.page || 1); // page 2 => 4 - 6
    const skip = Number((page - 1) * limit);
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
