import {test} from 'node:test';
import assert from 'node:assert/strict';
import {POST} from '../src/app/api/checkout/route';
import {POST as webhook} from '../src/app/api/payments/webhook/route';
const payload={items:[{product_id:'5f463cc3-cd90-4b5c-8501-055f0a7ff11a',quantity:1}],customer:{name:'სატესტო მომხმარებელი',phone:'599123456',city:'tbilisi',address:'სატესტო მისამართი 10'},idempotency_key:'2cd3ba42-0341-4cbd-ae8c-c19dd45326e4'};
function request(body:unknown,origin='http://localhost:3000'){return new Request('http://localhost:3000/api/checkout',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});}
test('valid guest checkout cannot simulate payment while provider is missing',async()=>{const response=await POST(request(payload));assert.equal(response.status,503);const result=await response.json();assert.equal(typeof result.error,'string');assert.equal('order' in result,false);assert.equal('url' in result,false);});
test('cross-origin checkout is denied before validation',async()=>{assert.equal((await POST(request(payload,'https://unrelated.example'))).status,403);});
test('same-origin development checkout works when Next uses an internal binding URL', async () => {
  const response = await POST(new Request('http://0.0.0.0:3090/api/checkout', {
    method: 'POST',
    headers: { host: 'localhost:3090', origin: 'http://localhost:3090' },
    body: JSON.stringify(payload),
  }));
  assert.equal(response.status, 503);
});
test('malformed, oversized, and invalid checkout requests fail safely',async()=>{
  assert.equal((await POST(request({}))).status,422);
  assert.equal((await POST(new Request('http://localhost:3000/api/checkout',{method:'POST',headers:{origin:'http://localhost:3000'},body:'{'}))).status,400);
  assert.equal((await POST(request({notes:'x'.repeat(21000)}))).status,413);
  assert.equal((await POST(request({notes:'ა'.repeat(7000)}))).status,413);
});
test('unconfigured payment callbacks cannot mutate payment status',async()=>{assert.equal((await webhook()).status,503);});
