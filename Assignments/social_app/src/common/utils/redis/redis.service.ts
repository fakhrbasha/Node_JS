import { emailEnum } from "../../enum/user.enum";
import { redisClient } from "./redis.db";

export const otpKey = (email: string, subject = emailEnum.confirmedEmail) => {
    return `otp::${email}::${subject}`
}


export const setValue = async (
    { key, value, ttl }: { key: string; value: any; ttl?: number }
) => {
    try {
        if (!key) throw new Error("Redis key is required");
        if (value === undefined) throw new Error("Redis value is undefined");

        const data =
            typeof value === 'string'
                ? value
                : JSON.stringify(value);

        return ttl
            ? await redisClient.setEx(key, ttl, data)
            : await redisClient.set(key, data);

    } catch (error) {
        console.error("Error setting value in Redis:", error);
        throw error;
    }
}

export const getValue = async (
    { key }: { key: string }
) => {
    try {
        const value = await redisClient.get(key);
        try {
            return value ? JSON.parse(value) : null;
        } catch {
            return value;
        }
    } catch (error) {
        console.error("Error getting value from Redis:", error);
        throw error;
    }
}

export const update = async (
    { key, value, ttl }: { key: string; value: any; ttl?: number }
) => {
    try {
        if (!(await redisClient.exists(key))) {
            return 0;
        }
        return await setValue({ key, value, ttl });
    } catch (error) {
        console.log("error to update data in redis", error);
    }
}

export const deleteKey = async (
    { key }: { key: string }
) => {
    try {
        if (!key.length) return 0
        return await redisClient.del(key);
    } catch (error) {
        console.error("Error deleting key from Redis:", error);
        throw error;
    }
}