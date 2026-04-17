"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findById(id) {
        return this.model.findById(id);
    }
    async findOne({ filter, projection }) {
        return this.model.findOne(filter, projection);
    }
    async find({ filter, projection, options }) {
        return this.model.find(filter, projection)
            .sort(options?.sort)
            .skip(options?.skip)
            .limit(options?.limit)
            .populate(options?.populate);
    }
    async findOneAndUpdate({ id, update, options }) {
        return this.model.findByIdAndUpdate(id, update, { ...options, new: true });
    }
    async findOneAndDelete(id) {
        return this.model.findByIdAndDelete(id);
    }
    async update(filter, data) {
        return this.model.findOneAndUpdate(filter, data, { new: true });
    }
}
exports.default = BaseRepository;
