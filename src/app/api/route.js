// app/api/sendMail/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { nome, escolhido } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL, 
      pass: process.env.MY_PASS   
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: process.env.MY_EMAIL, // manda para você mesmo
      subject: "Novo Sorteio de Tema AVL",
      text: `Aluno: ${nome}\nTema sorteado: ${escolhido}`
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err });
  }
}
