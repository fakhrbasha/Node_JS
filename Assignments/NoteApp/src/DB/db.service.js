

export const create = async ({ model, data } = {}) => {
    return await model.create(data)
}

export const findOne = async ({ model, filter = {}, options = {} } = {}) => {
    const doc = model.findOne(filter)
    if (options.populate) {
        doc.populate(options.populate)
    }
    if (options.skip) {
        doc.skip(options.skip)
    }
    if (options.limit) {
        doc.limit(options.limit)
    }
    return await doc.exec()
}
export const find = async ({ model, filter = {}, options = {} } = {}) => {
    const doc = model.find(filter)
    if (options.populate) {
        doc.populate(options.populate)
    }
    if (options.skip) {
        doc.skip(options.skip)
    }
    if (options.limit) {
        doc.limit(options.limit)
    }
    return await doc.exec()
}

export const updateOne = async ({ model, filter = {}, update = {}, options = {} } = {},) => {
    const doc = model.updateOne(filter, update, { runValidators: true, ...options })
    return await doc.exec()
}
export const updateMany = async ({ model, filter = {}, update = {}, options = {} } = {},) => {
    const doc = model.updateMany(filter, update, { runValidators: true, ...options })
    return await doc.exec()
}
export const findByIdAndUpdate = async ({ model, filter = {}, update = {}, options = {} } = {},) => {
    const doc = model.findByIdAndUpdate(filter, update, { new: true, runValidators: true, ...options })
    return await doc.exec()
}

export const deleteOne = async ({ model, filter } = {}) => {
    const doc = model.findByIdAndDelete(filter)
    return await doc.exec()
}