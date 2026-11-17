import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculateTotal,formatMoney} from '../src/lib/money';
import {checkoutSchema,productSchema,settingsSchema} from '../src/lib/validation';
import {canTransition} from '../src/lib/orders';

const productId='5f463cc3-cd90-4b5c-8501-055f0a7ff11a';
const validCheckout={items:[{product_id:productId,quantity:2}],customer:{name:'ნინო ტესტი',phone:'+995599123456',city:'tbilisi',address:'სატესტო მისამართი 10'},idempotency_key:'2cd3ba42-0341-4cbd-ae8c-c19dd45326e4'};
test('money uses integer arithmetic and rejects malformed totals',()=>{
  assert.equal(calculateTotal([{price_minor:1999,quantity:3}],500),6497);
  for(const quantity of [0,-1,1.5,100,NaN])assert.throws(()=>calculateTotal([{price_minor:100,quantity}],0));
  assert.throws(()=>calculateTotal([{price_minor:Number.MAX_SAFE_INTEGER,quantity:2}],0));
  assert.throws(()=>calculateTotal([],1.2));assert.throws(()=>formatMoney(-10));
  assert.equal(formatMoney(1200), '12\u00a0₾');
  assert.equal(formatMoney(1234), '12,34\u00a0₾');
  assert.equal(formatMoney(1200101), '12\u00a0001,01\u00a0₾');
});
test('checkout accepts guest data without account or card fields',()=>{assert.equal(checkoutSchema.safeParse(validCheckout).success,true);});
test('checkout rejects duplicates, invalid phone, empty cart, unsafe quantities',()=>{
  assert.equal(checkoutSchema.safeParse({...validCheckout,items:[...validCheckout.items,...validCheckout.items]}).success,false);
  assert.equal(checkoutSchema.safeParse({...validCheckout,items:[]}).success,false);
  assert.equal(checkoutSchema.safeParse({...validCheckout,customer:{...validCheckout.customer,phone:'123'}}).success,false);
  assert.equal(checkoutSchema.safeParse({...validCheckout,items:[{product_id:productId,quantity:-1}]}).success,false);
});
test('prices and totals supplied by clients are not part of checkout payload',()=>{
  const result=checkoutSchema.parse({...validCheckout,total_minor:1,items:[{...validCheckout.items[0],price_minor:1}]});
  assert.equal('total_minor' in result,false);assert.equal('price_minor' in result.items[0],false);
});
test('fulfillment advances only after verified payment and cannot resurrect cancellation',()=>{
  assert.equal(canTransition('pending','confirmed','pending'),false);
  assert.equal(canTransition('pending','confirmed','paid'),true);
  assert.equal(canTransition('pending','delivered','paid'),false);
  assert.equal(canTransition('cancelled','confirmed','paid'),false);
  assert.equal(canTransition('shipped','delivered','paid'),true);
  assert.equal(canTransition('pending','cancelled','failed'),true);
});
test('delivery configuration rejects duplicate zone ids and negative prices',()=>{
  const base={contact_email:'',contact_phone:'',policies:{}};
  assert.equal(settingsSchema.safeParse({...base,delivery_zones:[{id:'tbilisi',name:'თბილისი',price_minor:-10}]}).success,false);
  const zone={id:'tbilisi',name:'თბილისი',price_minor:500};
  assert.equal(settingsSchema.safeParse({...base,delivery_zones:[zone,zone]}).success,false);
});
test('product requires real price, secure media, age and safety information',()=>{
  assert.equal(productSchema.safeParse({name:'სატესტო',slug:'test',description:'აღწერა საცდელი პროდუქტისთვის',short_description:'მოკლე აღწერა',price_minor:0,stock:0,age_label:'',dimensions:'',safety_info:'',image_url:'http://example.com/a.jpg',published:true}).success,false);
});
