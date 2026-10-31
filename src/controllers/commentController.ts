import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";
import { chownSync } from "node:fs";

export const createComment = async (req: Request, res: Response) => {
    const {content, postId, userId} = req.body ?? {};
    if (!content || !postId || !userId) {
        throw new HttpError(400, "content, postId, userId wajib diisi")
    }

    const comments = await prisma.comment.create({
        data: {content, postId: Number(postId), userId: Number(userId)}
    });
    sendSuccess(res, 201, "Komentar berhasil dibuat", comments);
}

export const getAllCOmments = async (_req: Request, res: Response) => {
    const comments = await prisma.comment.findMany({
        include: {
            user: {select: {id: true, name: true, email: true}},
            post: {select: {id: true, title: true}}
        },
        orderBy: {createdAt: "desc"}
    });
    sendSuccess(res, 200, "Berhasil mengambil semua komentar", comments);
}

export const getCommentById = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    const comments = await prisma.comment.findUnique({
        where: {id},
        include: {user:true, post: true}
    });
    if(!comments) throw new HttpError(404, "Komentar tidak ditemukan");

    sendSuccess(res, 200, "Berhasil mengambil komentar", comments);
}

export const updateComment = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    const {content} = req.body ?? {};
    if(!content) throw new HttpError(400, "content wajib diisi");
    const comments = await prisma.comment.update({
        where: {id},
        data: {content}
    });
    sendSuccess(res, 200, "Berhasil mengupdate komentar", comments);
}

export const deleteComment = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    await prisma.comment.delete({where: {id}});
    sendSuccess(res, 200, "Komentar berhasil di hapus")
}