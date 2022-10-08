if (item.type == 'income') {
    id('income').innerHTML += itemdiv;
    income=income+parseInt(item.amt);
    id('incomeamt').innerHTML=income;
    totalamt=totalamt+income;
    id('totalamt').innerHTML=totalamt;
  }
  else if (item.type == 'expence') {
    id('expence').innerHTML += itemdiv;
    expense=expense+parseInt(item.amt);
    id('expenceamt').innerHTML=expense;
    totalamt=totalamt-expense;
    id('totalamt').innerHTML=totalamt;
  }