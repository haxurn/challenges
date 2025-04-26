import { createId } from "@paralleldrive/cuid2";
import { integer, text } from "drizzle-orm/pg-core"; 
import { user } from "./user";

export function boolean(name: string) {
	return integer(name);
}

export function date(name: string) {
	const defaultValue = Math.floor(Date.now() / 1000);
	return integer(name).default(defaultValue);
}

export function id(name?: string) {
	return text(name ?? "id")
		.primaryKey()
		.default(createId());
}

export function userId() {
	return text("userId")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull();
}
