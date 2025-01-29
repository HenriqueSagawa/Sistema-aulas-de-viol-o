import { NextResponse } from "next/server"
import { db } from "@/services/firebaseConnection"
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const alunosRef = collection(db, "alunos")
        
        const novoAluno = {
            ...body,
            createdAt: new Date().toISOString()
        }

        const docRef = await addDoc(alunosRef, novoAluno)
        
        return NextResponse.json({ 
            id: docRef.id,
            ...novoAluno
        }, { status: 201 })

    } catch (error) {
        console.error("Erro ao salvar aluno:", error)
        return NextResponse.json({ 
            error: "Erro ao salvar aluno" 
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const turmaId = searchParams.get('turmaId')

        if (!turmaId) {
            return NextResponse.json({ 
                error: "ID da turma é obrigatório" 
            }, { status: 400 })
        }

        const alunosRef = collection(db, "alunos")
        const q = query(alunosRef, where("turmaId", "==", turmaId))
        const querySnapshot = await getDocs(q)
        
        const alunos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        return NextResponse.json({ alunos }, { status: 200 })

    } catch (error) {
        console.error("Erro ao buscar alunos:", error)
        return NextResponse.json({ 
            error: "Erro ao buscar alunos" 
        }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const alunoId = searchParams.get('id')

        if (!alunoId) {
            return NextResponse.json({ 
                error: "ID do aluno é obrigatório" 
            }, { status: 400 })
        }

        const alunoRef = doc(db, "alunos", alunoId)
        await deleteDoc(alunoRef)

        return NextResponse.json({ 
            message: "Aluno removido com sucesso" 
        }, { status: 200 })

    } catch (error) {
        console.error("Erro ao remover aluno:", error)
        return NextResponse.json({ 
            error: "Erro ao remover aluno" 
        }, { status: 500 })
    }
} 