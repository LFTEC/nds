import bcrypt from 'bcrypt';

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const password = searchParams.get('password') || '12345678';
    const hash = await bcrypt.hash(password, 10);

    return Response.json({hash: hash});
}