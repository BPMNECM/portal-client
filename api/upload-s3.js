// import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
// import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
//
// /**
//  * route handler that will handle the creation of the presigned URLs that we will use to upload files to our S3
// bucket */  const client = new S3Client({ region: process.env.S3_REGION, credentials: { accessKeyId:
// process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_SECRET_KEY } });  export async function GET(request) {
// const {searchParams} = request.nextUrl;  const file = searchParams.get('file');  if (!file) { return Response.json(
// {error: 'File query parameter is required'}, {status: 400} ); }  const command = new PutObjectCommand({ Bucket:
// process.env.S3_BUCKET_NAME, Key: file });  const url = await getSignedUrl(client, command, {expiresIn: 60});  return
// Response.json({presignedUrl: url}); }
